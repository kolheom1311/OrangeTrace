import {
  getAuth,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function deleteAccountWithReauth(email: string, password: string, userId: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || user.uid !== userId) {
    throw new Error("Unauthorized or no user logged in.");
  }

  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    await deleteDoc(doc(db, "users", userId));
    await deleteUser(user);
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many attempts. Please try again later.");
    } else {
      throw error;
    }
  }
}

export async function updatePasswordWithReauth(email: string, currentPassword: string, newPassword: string) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  const credential = EmailAuthProvider.credential(email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect current password.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many attempts. Please try again later.");
    } else {
      throw error;
    }
  }
}
