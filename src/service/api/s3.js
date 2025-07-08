import jwtAxios from "../util/JwtUtil";

export const getPresignedUrls = async (folder, filenames) => {
  const res = await jwtAxios.post("/api/s3/presigned", {
    folder,
    filenames,
  });
  return res.data;
};

export const deleteImages = async (urls) => {
  await jwtAxios.post("/api/s3/delete", urls);
};
