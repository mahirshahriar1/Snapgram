import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    localStorage.setItem("session", session.userId);
    //userId stored as a sessionId -> purpose of storing
    //is after some time of user log in,
    //when try to fetch useId on reload the appWrite is unable to fetch resulting 401
    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function getCurrentUser() {
  try {
    const currentAccountId = localStorage.getItem("sessionId"); 
    //sessionId is the userId stored in localStorage

    if (currentAccountId !== null) {

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,       
        [Query.equal("accountId", currentAccountId)]
      );
    

      if (!currentUser) throw Error;

      return currentUser.documents[0];
    }
  } catch (error) {
    console.log(error);
  }
}

