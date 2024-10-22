rm -rf gchat.zip
rm -rf gchat
npm run build
mv build gchat
zip -r gchat.zip gchat
node buildUploadToS3.js
rm -rf gchat
rm -rf gchat.zip