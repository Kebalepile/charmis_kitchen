/**
 * @description SMS sending logic
 */

const {
  sendResponse,
  handleError,
  clickatellApi,
  notifyClients
} = require("../utils/helpers");

const SendSms = async (req, res) => {
  const { to, message } = req.body;

  try {
    const data = await clickatellApi(to, message);

    if (data.messages && data.messages[0].accepted) {
      sendResponse(res, 200, { success: true });

      // Notify clients that SMS was sent successfully
      notifyClients({ type: "smsSent", info: { to, message } });
    } else {
      sendResponse(res, 500, { success: false, error: "Failed to send SMS" });

      // Notify clients that SMS failed to send
      notifyClients({ type: "smsFailed", info: { to, message } });
    }
  } catch (error) {
    handleError(res, error);

    // Notify clients that an error occurred while sending SMS
    notifyClients({
      type: "smsError",
      info: { to, message, error: error.message }
    });
  }
};

module.exports = { SendSms };
