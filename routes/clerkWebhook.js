import { verifyWebhook } from "@clerk/express/webhooks";
import express from "express";
import { createOrUpdateUsers, deleteUsers } from "../actions/user.js";
import { clerkClient } from "@clerk/express";

const app = express();

app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req);

      // Do something with payload
      // For this guide, log payload to console
      const { id } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.created" || eventType === "user.updated") {
        const { first_name, last_name, email_addresses, image_url } = evt.data;

        try {
          const user = await createOrUpdateUsers(
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
          );

          if (user && eventType === "user.created") {
            console.log("start creating and updating");
            try {
              await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                  mongoId: user._id,
                },
              });
              return res.json({ success: true, msg: "User created" });
            } catch (err) {
              return res.json({
                success: false,
                msg: `Failed to setup metadata, ${err.message}`,
              });
            }
          }
          return res.json({
            success: true,
            msg: "User created or updated successfully",
          });
        } catch (err) {
          return res.json({
            success: false,
            msg: `Failed to create or update users, not metadata, ${err.message}`,
          });
        }
      }

      if (eventType === "user.deleted") {
        try {
          const deleteUser = await deleteUsers(id);
          return res.json({ success: true, msg: "user deleted" });
        } catch {
          return res.json({ success: false, msg: "failed to delete user" });
        }
      }

      return res.send("Webhook received");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).send("Error verifying webhook");
    }
  }
);
export default app;
