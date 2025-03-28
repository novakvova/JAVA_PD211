'use client'

import React, {useRef, useState} from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default function ImageModal() {
    const [open, setOpen] = useState(false)

    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<Cropper | null>(null);
    //Зображення зберігаємо у форматі Base64
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    // Initialize cropper when image loads
    const onLoad = () => {
        if (imageRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 1, // Square cropping
                viewMode: 1, // Restrict cropper to image boundaries
                zoomable: true,
                scalable: false,
                movable: false,
            });
        }
    };

    // Crop the image
    const cropImage = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas();
            if (canvas) {
                setCroppedImage(canvas.toDataURL("image/png"));
            }
        }
    };

    return (
        <>

            <label htmlFor={"fileSelect"}
                   className={"cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>
                Обрати фото
            </label>

            <input id={"fileSelect"} type={"file"} style={{display: "none"}} onChange={(e) => {
                if (e.target.files) {
                    setOpen(true);
                    if (e.target.files[0]) {
                        const file = e.target.files[0];
                        console.log("img currnet", imageRef.current);
                        if (imageRef.current) {
                            imageRef.current.src = URL.createObjectURL(file);

                            if (cropperRef.current) {
                                cropperRef.current.destroy();
                            }

                            cropperRef.current = new Cropper(imageRef.current, {
                                aspectRatio: 1, // Square cropping
                            });
                        }


                        console.log("select files", file);
                    }
                }

            }}/>


            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                            Deactivate account
                                        </DialogTitle>
                                        <div className="mt-2">
                                            {/* Image Preview */}
                                            <div className="border rounded-md p-2">
                                                <img
                                                    ref={imageRef}
                                                    src="https://picsum.photos/600/400"
                                                    alt="Upload"
                                                    onLoad={onLoad}
                                                    className="max-w-full"
                                                />
                                            </div>

                                            {/* Crop Button */}
                                            <button
                                                onClick={cropImage}
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                            >
                                                Обрізати фото
                                            </button>

                                            {/* Cropped Image Preview */}
                                            {croppedImage && (
                                                <div className="mt-4">
                                                    <h3 className="text-lg font-semibold">Cropped Image:</h3>
                                                    <img src={croppedImage} alt="Cropped" className="border rounded-md"/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                >
                                    Deactivate
                                </button>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>

    )
}
