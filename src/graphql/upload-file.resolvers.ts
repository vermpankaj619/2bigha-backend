const { GraphQLUpload } = require('graphql-upload');
const uploadFile = async (_, { file }, { uploadService }) => {
  const resolvedFile = await file; // file = Promise<{ filename, mimetype, encoding, createReadStream }>
  
  // ✅ This is where your service function is used:
  return uploadService.uploadFile(resolvedFile);
};

module.exports = {
  Upload: GraphQLUpload,
  uploadFile,
};
