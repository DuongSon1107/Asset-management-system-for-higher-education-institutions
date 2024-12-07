import { Button, Input } from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import React, { ChangeEvent, useState } from 'react'

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      // Check if the selected file is of type xlsx
      if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setSelectedFile(file)
      } else {
        // Display an error message or handle invalid file type
        console.error('Invalid file type. Please select a .xlsx file.')
      }
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)

      axios
        .post('/api/upload', formData, {
          onUploadProgress: progressEvent => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            setUploadProgress(progress)
          }
        })
        .then((response: AxiosResponse) => {
          console.log('File uploaded successfully:', response.data)
          // Handle success, update UI, etc.
        })
        .catch(error => {
          console.error('Error uploading file:', error)
          // Handle error, update UI, etc.
        })
    }
  }

  return (
    <div>
      <Input type='file' accept='.xlsx' onChange={handleFileChange} />
      <Button variant='contained' color='primary' onClick={handleUpload}>
        Upload
      </Button>
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
    </div>
  )
}

Page.acl = {
  action: 'manage',
  subject: 'setting-page'
}
