import React from 'react'
import styles from './index.module.less'
import { Upload, message, Button } from '@wind/wind-ui';
import { FileUploadC } from '@wind/icons';
const Dragger = Upload.Dragger;

const AIChartsUpload = () => {

    const props = {
        name: 'file',
        multiple: true,
        showUploadList: false,
        action: '/upload',  // 上传接口
        onChange(info) {
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };



    return (
        <div className={styles.aiChartsUpload}>
            <div className={styles.aiChartsUploadTitle}>
                上传数据
            </div>
            <div className={styles.aiChartsUploadContent}>
                <div className={styles.aiChartsUploadContentTitle}>
                    <div>第一步：点击下载<a>模板文件</a>，并在此Excel文件中补充数据</div>
                    <div>第二步：保存文件后，点击下方按钮或拖拽文件到下方区域导入文件</div>
                </div>
                <div className={styles.aiChartsUploadContentBody}>
                    <Dragger {...props} >
                        {/* @ts-ignore */}
                        <FileUploadC style={{ fontSize: 80 }} />
                        <p className={styles.aiChartsUploadContentButtonUploadText}>* 点击或拖拽上传文件到此处上传，支持Excel</p>
                        {/* @ts-ignore */}
                        <Button className={styles.aiChartsUploadContentButtonUpload} variant="alice">点击或拖拽上传文件</Button>
                    </Dragger>
                </div>
                <div className={styles.aiChartsUploadContentButton}>
                    <Button className={styles.aiChartsUploadContentButtonCancel}>取消</Button>
                    <Button disabled={true} className={styles.aiChartsUploadContentButtonOK}>生成图谱</Button>
                </div>
            </div>
        </div >
    )
}

export default AIChartsUpload
