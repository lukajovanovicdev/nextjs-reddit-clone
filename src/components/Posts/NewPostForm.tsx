import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';

type NewPostFormProps = {};

const formTabs: TabItemT[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  { title: 'Images & Video', icon: IoImageOutline },
  { title: 'Link', icon: BsLink45Deg },
  { title: 'Poll', icon: BiPoll },
  { title: 'Talk', icon: BsMic },
];

export type TabItemT = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {};

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) reader.readAsDataURL(event.target.files[0]);

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) setSelectedFile(readerEvent.target.result as string);
    };
  };

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            item={item}
            key={item.title}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            handleCreatePost={handleCreatePost}
            textInputs={textInputs}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            setSelectedFile={setSelectedFile}
            onSelectImage={onSelectImage}
            setSelectedTab={setSelectedTab}
            selectedFile={selectedFile}
          />
        )}
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
