import AWS from 'aws-sdk';

// AWS 설정
AWS.config.update({
  region: process.env.VUE_APP_AWS_REGION || 'ap-northeast-2',
  accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY
});

// S3 버킷 설정
export const s3Config = {
  bucketName: process.env.VUE_APP_S3_BUCKET_NAME,
  region: process.env.VUE_APP_AWS_REGION || 'ap-northeast-2'
};

// S3 클라이언트 생성
export const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: s3Config.bucketName }
});

// 이미지 업로드 함수
export const uploadImage = async (file, folder = 'images/') => {
  try {
    const fileName = `${folder}${Date.now()}-${file.name}`;
    const params = {
      Bucket: s3Config.bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location; // 업로드된 이미지 URL 반환
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
}; 