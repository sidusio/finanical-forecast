import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as synced from '@pulumi/synced-folder';

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket('financial-forecast-static-site', {
	location: 'EUROPE-WEST2',
	website: {
		mainPageSuffix: 'index.html'
	},
	uniformBucketLevelAccess: true
});

// Export the DNS name of the bucket
export const bucketName = bucket.url;

new synced.GoogleCloudFolder('financial-forecast-static-site-content', {
	bucketName: bucket.name,
	path: '../build'
});

new gcp.storage.BucketIAMBinding('financial-forecast-static-site-bucket-binding', {
	bucket: bucket.name,
	role: 'roles/storage.objectViewer',
	members: ['allUsers']
});

export const bucketEndpoint = pulumi.concat(
	'http://storage.googleapis.com/',
	bucket.name,
	'/',
	'index.html'
);

const backendBucket = new gcp.compute.BackendBucket('financial-forecast-backend-bucket', {
	bucketName: bucket.name,
	description: 'Backend bucket for financial-forecast-static-site',
	enableCdn: false,
	//compressionMode: 'AUTOMATIC'
});

export const backendBucketName = backendBucket.name;
