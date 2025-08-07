import UserModel from "../Models/UserModel";

export async function createOrUpdateUsers(
  id,
  first_name,
  last_name,
  email_addresses,
  image_url
) {
  try {
    const user = await UserModel.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          clerkId: id,
          firstName: first_name,
          lastName: last_name,
          email: email_addresses[0].email_addresses,
          profilePic: image_url,
        },
      },
      { upsert: true, new: true }
    );
    return user;
  } catch (err) {
    console.log("Could not update or add users", err.message);
  }
}

export async function deleteUsers(id) {
  try {
    const res = await UserModel.findOneAndDelete({ clerkId: id });
  } catch (err) {
    console.log("Failed to delete users", err.message);
  }
}
