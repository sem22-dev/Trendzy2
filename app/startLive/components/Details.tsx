"use client"

import React from 'react';
import { Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import Image from 'next/image';
import { useFormikContext } from 'formik';
import Resizer from 'react-image-file-resizer'; // Import the Resizer function


const Details = (props: any) => {
    const { errors, values } = props;

    const MAX_FILE_SIZE_THRESHOLD = 300 * 1024; // 200KB

  const { setFieldValue } = useFormikContext();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  

  if (file) {
    try {
      if (file.size > MAX_FILE_SIZE_THRESHOLD) {
        // Compress the image if it exceeds the threshold
        Resizer.imageFileResizer(
          file,
          200, // Resize to 200px height
          200, // Resize to 200px width
          'JPEG', // Format
          75, // Quality (75%)
          0, // Rotation
          async (uri: any) => {
            const compressedBase64String = uri.split(',')[1];

            setFieldValue('thumbnail', compressedBase64String);

            // Update the thumbnailPreview state
            setThumbnailPreview(compressedBase64String);
          }
        );
      } else {
        // Upload the original image if it's within the threshold
        const reader = new FileReader();
        reader.onload = async () => {
          if (typeof reader.result === 'string') {
            const base64String = reader.result.split(',')[1];

            setFieldValue('thumbnail', base64String);

            // Update the thumbnailPreview state
            setThumbnailPreview(base64String);
          } else {
            console.error('Error reading file as a string.');
          }
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading thumbnail image:', error);
    }
  }
};

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    // Add any additional logic you need when removing the thumbnail.
  };


    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // State to store thumbnail preview URL
  return (

          <Form className="bg-transparent shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-bold mb-2">
                Title:
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                values={values}
                placeholder="Add a title"
                className="shadow appearance-none placeholder:text-sm bg-bgDark rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="title" component="p" className="text-red-500 text-xs italic" />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-bold mb-2">
                Category:
              </label>
              <Field
                as="select"
                id="category"
                name="category"
                values={values}
                className="shadow appearance-none bg-bgDark rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </Field>
              <ErrorMessage name="category" component="p" className="text-red-500 text-xs italic" />
            </div>

      <div className="mb-4">
        <label htmlFor="thumbnail" className="block text-sm font-bold mb-2">
          Thumbnail:
        </label>
        <div className="relative">
      {thumbnailPreview ? (
        <div className="relative">
          <Image
            width={1000}
            height={1000}
            src={`data:image/jpeg;base64,${thumbnailPreview}`}
            alt="Uploaded Thumbnail"
            className="w-48 max-h-48 mx-auto object-contain"
          />
          <div className="absolute top-0 right-0 m-2">
            <div className="bg-gray-700 text-white p-2 rounded-full cursor-pointer">
              <button onClick={removeThumbnail}>Remove</button>
            </div>
            {/* Add more options (e.g., Change, Undo) here */}
          </div>
        </div>
      ) : (
        <label
          htmlFor="thumbnail"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center"
        >
          Upload Thumbnail
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
        <ErrorMessage name="thumbnail" component="p" className="text-red-500 text-xs italic" />
      </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-bold mb-2">
                Tags:
              </label>
              <Field
                as="textarea"
                id="tags"
                name="tags"
                values={values}
                className="shadow appearance-none bg-bgDark rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="tags" component="p" className="text-red-500 text-xs italic" />
            </div>
          </Form>
  ) 
};

export default Details;
