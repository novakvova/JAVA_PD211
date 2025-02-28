import React, {useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {IProductCreate} from "./types.ts";
import TextArea from "antd/es/input/TextArea";
import {useNavigate} from "react-router-dom";
import {useCreateProductMutation} from "../../services/productsApi.ts";
import {useGetCategoriesQuery} from "../../services/apiCategory.ts";

import {CloseCircleOutlined} from '@ant-design/icons';

const {Item} = Form;

const ProductCreatePage : React.FC = () => {

    const {data: categories, isLoading: categoriesLoading, error: categoriesError} = useGetCategoriesQuery();
    const [form] = Form.useForm<IProductCreate>();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const navigate = useNavigate();
    const [createProduct] = useCreateProductMutation();

    const onFinish = async (values: IProductCreate) => {
        try {
            values.images = selectedFiles;
            //console.log("Server send data: ", values);
            const response = await createProduct(values).unwrap();
            console.log("Категорія успішно створена:", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка під час створення категорії:", error);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const categoriesData = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    return (
        <>
            <h1 className={"text-center text-4xl font-bold text-blue-500"}>Додати товар</h1>

            <div style={ {maxWidth:'600px', margin:'0 auto'}}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical">
                    <Item
                        name="name"
                        label={"Назва товару"}
                        rules={[
                            {required:true, message:"Вкажіть назву категорії"}
                        ]}>
                        <Input placeholder={"Назва"}/>
                    </Item>

                    <Item
                        name="price"
                        label={"Ціна товару"}
                        rules={[
                            {required:true, message:"Вкажіть ціну категорії"}
                        ]}>
                        <Input placeholder={"Ціна"}/>
                    </Item>

                    {categoriesLoading ? (
                        <p>Loading categories...</p>
                    ) : categoriesError ? (
                        <p className="text-red-500">Failed to load categories</p>
                    ) : (
                        <Form.Item
                            label="Категорія"
                            name="categoryId"
                            htmlFor="categoryId"
                            rules={[{required: true, message: "Це поле є обов'язковим!"}]}
                        >
                            <Select placeholder="Оберіть категорію: " options={categoriesData}/>
                        </Form.Item>
                    )}

                    <Item
                        name="description"
                        label={"Опис"}>
                        <TextArea placeholder={"Опис..."} rows={4}/>
                    </Item>


                    {/* Поле для завантаження файлів */}
                    <Form.Item label="Фото продукту" name="images">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                    </Form.Item>


                    {/* Відображення вибраних зображень */}
                    {selectedFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        style={{maxWidth: "150px", maxHeight: "150px"}}
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <CloseCircleOutlined/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}


                    <Item>
                        <Button type="primary" htmlType="submit">
                            Створити продукт
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    )
}

export default ProductCreatePage;