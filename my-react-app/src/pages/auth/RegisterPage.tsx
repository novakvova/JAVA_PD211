import React, {useRef, useState} from "react";
import {Button, Form, Input} from "antd";
import {IUserRegisterRequest} from "./types.ts";
import {useNavigate} from "react-router-dom";
import {useRegisterUserMutation} from "../../services/authApi.ts";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const {Item} = Form;

const RegisterPage: React.FC = () => {

    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<Cropper | null>(null);
    //Зображення зберігаємо у форматі Base64
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const [form] = Form.useForm<IUserRegisterRequest>();
    const navigate = useNavigate();
    const [registerUser] = useRegisterUserMutation();

    const onFinish = async (values: IUserRegisterRequest) => {
        try {
            console.log("Register user", values);
            const response = await registerUser(values).unwrap();
            console.log("Користувача успішно зареєстровано", response);
            navigate("..");
        } catch (error) {
            console.error("Поилка при реєстрації", error);
        }
    }

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
            <h1 className={"text-center text-4xl font-bold text-blue-500"}>Реєстрація на сайті</h1>

            <div style={{maxWidth: '400px', margin: '0 auto'}}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical">

                    <Item
                        name="username"
                        label={"Електронна пошта"}
                        rules={[
                            {required: true, message: "Вкажіть свою пошшту"},
                            {type: "email", message: "Введіть коректний email"}
                        ]}>
                        <Input placeholder={"Електронна пошта"}/>
                    </Item>

                    <label htmlFor={"fileSelect"}
                           className={"cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>
                        Обрати фото
                    </label>

                    <input id={"fileSelect"} type={"file"} style={{display: "none"}} onChange={(e) => {
                        if (e.target.files) {
                            if (e.target.files[0]) {
                                const file = e.target.files[0];
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

                    {/* Image Preview */}
                    <div className="border rounded-md p-2">
                        <img
                            ref={imageRef}
                            src="https://picsum.photos/600/400?grayscale"
                            alt="Upload"
                            // onLoad={onLoad}
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

                    <Item
                        name="password"
                        label="Пароль"
                        rules={[
                            {required: true, message: "Введіть пароль"},
                            {min: 6, message: "Пароль має містити щонайменше 6 символів"}
                        ]}
                    >
                        <Input.Password placeholder="Введіть пароль"/>
                    </Item>

                    <Item
                        name="confirmPassword"
                        label="Підтвердження паролю"
                        dependencies={["password"]}
                        rules={[
                            {required: true, message: "Підтвердіть пароль"},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Паролі не співпадають"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Повторіть пароль"/>
                    </Item>

                    <Item>
                        <Button type="primary" htmlType="submit">
                            Реєстарція
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    )
}

export default RegisterPage;