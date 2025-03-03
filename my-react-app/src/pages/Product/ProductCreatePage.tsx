import React, {useState} from "react";
import {Button, Form, Input, Select, Upload, UploadFile} from "antd";
import {IProductCreate} from "./types.ts";
import TextArea from "antd/es/input/TextArea";
import {useNavigate} from "react-router-dom";
import {useCreateProductMutation} from "../../services/productsApi.ts";
import {useGetCategoriesQuery} from "../../services/apiCategory.ts";

import {PlusOutlined} from '@ant-design/icons';
import {DragDropContext, Draggable, Droppable, DropResult} from "@hello-pangea/dnd";

const {Item} = Form;

const ProductCreatePage : React.FC = () => {

    const {data: categories, isLoading: categoriesLoading, error: categoriesError} = useGetCategoriesQuery();
    const [form] = Form.useForm<IProductCreate>();
    const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
    const navigate = useNavigate();
    const [createProduct, {isLoading: productIsLogding}] = useCreateProductMutation();

    const onFinish = async (values: IProductCreate) => {
        try {
            values.images = selectedFiles.map(x=>x.originFileObj as File);
            console.log("Server send data: ", values);
            const response = await createProduct(values).unwrap();
            console.log("Категорія успішно створена:", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка під час створення категорії:", error);
        }
    }

    const categoriesData = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(selectedFiles);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        setSelectedFiles(reorderedFiles);
    };


    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFileList = info.fileList.map((file, index) => ({
            ...file,
            uid: file.uid || Date.now().toString(),
            order: index,
        }));

        setSelectedFiles([...selectedFiles, ...newFileList]);
    };

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

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="upload-list" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Upload
                                                        listType="picture-card"
                                                        fileList={[file]}
                                                        onRemove={() => {
                                                            const newFileList = selectedFiles.filter(f => f.uid !== file.uid);
                                                            setSelectedFiles(newFileList);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Upload
                        multiple
                        listType="picture-card"
                        beforeUpload={() => false}
                        onChange={handleImageChange}
                        fileList={[]}
                        accept="image/*"
                    >
                        <div>
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Додати</div>
                        </div>
                    </Upload>


                    <Item>
                        <Button type="primary" htmlType="submit"
                                disabled={productIsLogding}>
                            {productIsLogding ? 'Створення...' : 'Створити продукт'}
                            Створити продукт
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    )
}

export default ProductCreatePage;