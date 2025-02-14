import React from "react";
import {Button, Form, Input} from "antd";
import {ICategoryPostRequest} from "./types.ts";
import TextArea from "antd/es/input/TextArea";
import {useNavigate} from "react-router-dom";
import {useCreateCategoryMutation} from "../../services/apiCategory.ts";

const {Item} = Form;

const CategoryCreatePage : React.FC = () => {

    const [form] = Form.useForm<ICategoryPostRequest>();
    const navigate = useNavigate();
    const [createCategory] = useCreateCategoryMutation();

    const onFinish = async (values: ICategoryPostRequest) => {
        try {
            const response = await createCategory(values).unwrap();
            console.log("Категорія успішно створена:", response);
            navigate("..");
        } catch (error) {
            console.error("Помилка під час створення категорії:", error);
        }
    }

    return (
        <>
            <h1 className={"text-center text-4xl font-bold text-blue-500"}>Додати категорію</h1>

            <div style={ {maxWidth:'400px', margin:'0 auto'}}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical">
                    <Item
                        name="name"
                        label={"Назва категорії"}
                        rules={[
                            {required:true, message:"Вкажіть назву категорії"}
                        ]}>
                        <Input placeholder={"Назва"}/>
                    </Item>

                    <Item
                        name="image"
                        label={"Image"}
                        rules={[
                            {required:true, message:"Вкажіть image"}
                        ]}>
                        <Input placeholder={"Image"}/>
                    </Item>

                    <Item
                        name="description"
                        label={"Опис"}>
                        <TextArea placeholder={"Опис..."} rows={4}/>
                    </Item>

                    <Item>
                        <Button type="primary" htmlType="submit">
                            Створити категорію
                        </Button>
                    </Item>
                </Form>
            </div>
        </>
    )
}

export default CategoryCreatePage;