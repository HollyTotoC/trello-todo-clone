import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return;
    const fileUploaded = await storage.createFile(
        "6529bb04d45f950f763e",
        ID.unique(),
        file
    );
    return fileUploaded;
};

export default uploadImage;
