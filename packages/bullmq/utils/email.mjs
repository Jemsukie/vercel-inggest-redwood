import { CONFIG } from '../service/config.mjs'

const emailProcess = ({
  data: { tribeId, email, name, tempPassword, batch, origin, template },
}) => {
  const params = {
    tribeId,
    email,
    name,
    batch,
    tempPassword,
    loginLink: `${origin}/login?extraData=${btoa(JSON.stringify({ email }))}`,
    forgotPasswordLink: `${origin}/set-new-password?extraData=${btoa(
      JSON.stringify({
        email,
        password: tempPassword,
      })
    )}`,
  }

  return sendEmail({
    to: email,
    template,
    params,
  })
}

const sendEmail = async ({ to, template, params }) => {
  const data = JSON.parse(template)
  return await fetch('https://api.brevo.com/v3/smtp/email', {
    // TODO, merge options.headers if exist
    headers: {
      accept: 'application/json',
      'api-key': CONFIG.brevo.apiKey,
    },
    method: 'POST',
    body: JSON.stringify({
      sender: {
        name: `"Atlas Admin" <${CONFIG.brevo.senderEmail}>`,
        email: CONFIG.brevo.tempSenderEmail,
      },
      to: [
        {
          email: to,
          name: params.name,
        },
      ],
      ...compileTemplate({ data, params }),
    }),
  })
}

const compileTemplate = ({ data, params }) => {
  let HTML_CONTENT = data.htmlContent
  let SUBJECT = data.subject

  const paramArray = Object.entries(params).map(([key, value]) => {
    return {
      toReplace: `{{params.${key}}}`,
      toPut: value,
    }
  })

  // Iterate through the paramArray and replace placeholders in the HTML
  paramArray.forEach((param) => {
    const { toReplace, toPut } = param
    const regex = new RegExp(
      toReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    )
    HTML_CONTENT = HTML_CONTENT.replace(regex, toPut)
    SUBJECT = SUBJECT.replace(regex, toPut)
  })

  return {
    htmlContent: HTML_CONTENT,
    subject: SUBJECT,
  }
}

export default emailProcess
