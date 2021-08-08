import {
  Box,
  Button,
  Center, FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image, Input,
  Spinner, Textarea, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from 'next/router';
import { useState } from "react";
import { WidgetLoader } from 'react-cloudinary-upload-widget';
import Profile from "../utils";
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const {
    values: { name, content, title },
    errors,
    dirty,
    handleChange,
    handleSubmit,
    resetForm,
    touched
  } = useFormik({
    initialValues: {
      name: "",
      content: "",
      title: ""
    },
    validate: (formValues) => {
      const errors = {};
      if (formValues.name === "" && touched) {
        errors.name = "Name must be filled";
      }
      if (formValues.content === "" && touched) {
        errors.content = "Message must be filled";
      }
      if (formValues.title === "" && touched) {
        errors.title = "Title must be filled";
      }
      if (formValues.name.indexOf("script") > -1) {
        errors.name = "invalid characters";
      }
      if (formValues.content.indexOf("script") > -1) {
        errors.content = "invalid characters";
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (url === null) {
        toast({
          description: "You must choose image!, Click on 'Select Image'",
          status: "error",
          position: "bottom",
          isClosable: true,
        });
      } else {
        alert({ ...values, image: url });
        console.log({ ...values, image: url });
        setLoading(true)
        const obj = {
          ...values, image: url
        }
        axios.post('https://store77.herokuapp.com/api/testmonials', obj)
          .then(() => { setLoading(false); router.push("/success") })
          .then(() => resetForm({}))
          .catch((err) => { setLoading(false); window.alert(err) })
      }
    },
  });
  return (
    <Box mb={8} w="full">
      <Heading mb={4} letterSpacing={1}>Submit Testmonial</Heading>
      {url &&
        <Center>
          <Image boxSize="200px"
            borderRadius="full"
            objectFit="cover" src={url} />
        </Center>

      }
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="What is your Good name?"
          value={name}
          name="name"
          errorBorderColor="crimson"
          isInvalid={errors?.name && touched.name ? true : false}
          onChange={handleChange}
        />
        {errors?.name && (
          <FormHelperText color="crimson">{touched.name ? errors.name : ""}</FormHelperText>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Textarea
          type="text"
          placeholder="Add a cool title Here!"
          value={title}
          name="title"
          errorBorderColor="crimson"
          isInvalid={errors?.title && touched.title ? true : false}
          onChange={handleChange}
          size="lg"
        />
        {errors?.title && (
          <FormHelperText color="crimson">{touched?.title ? errors.title : ""}</FormHelperText>
        )}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Messages</FormLabel>
        <Textarea
          type="text"
          placeholder="Write your Testmonial Here!"
          value={content}
          name="content"
          errorBorderColor="crimson"
          isInvalid={errors?.content && touched.content ? true : false}
          onChange={handleChange}
          size="lg"
        />
        {errors?.content && (
          <FormHelperText color="crimson">{touched?.content ? errors.content : ""}</FormHelperText>
        )}
      </FormControl>
      {
        url !== null ? "" : <FormControl>
          <WidgetLoader />
          <Profile url={url} setUrl={setUrl} />
        </FormControl>
      }

      <FormControl>
        <Button
          // disabled={!dirty || (dirty && Object.keys(errors).length > 0)}
          onClick={() => handleSubmit()}
          colorScheme="green"
          w="full"
          mt={3}
          mb={3}
        >
          {loading ? <Spinner /> : "Submit!"}
        </Button>
      </FormControl>
    </Box>
  );
};

export default Home;