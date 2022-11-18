import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  HStack,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';

type FormValues = {
  contractId: string;
  tokenId: string;
  percentage: string;
  receiver: string;
};

function WalletConnect(): JSX.Element {
  const { changeNetowrk, address, network } = useContext(WalletContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const baseUrl =
    network === 'PolygonMainnet' ? 'polygon.hokusai.app' : 'mumbai.hokusai.app';

  const apiKey = import.meta.env.VITE_HOKUSAI_API_KEY;
  const onSubmit = handleSubmit(async (values: FormValues) => {
    onClose();
    setIsLoading(true);
    await fetch(
      `https://${baseUrl}/v1/nfts/${values.contractId}/${values.tokenId}/royalty?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          percentage: values.percentage,
          receiver: values.receiver,
        }),
      }
    )
      .then((res) => {
        console.log('ressss', res);
        res.json();
      })
      .then((res) => {
        setIsLoading(false);
        // setResponse(genPolygonscanUrl(res as TxObj, network));
        console.log('ressss', res);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  });

  return (
    <>
      <VStack p={4}>
        {isLoading && <Spinner />}
        <Button
          style={{ position: 'absolute', right: 10 }}
          onClick={() => {
            onOpen();
          }}
        >
          Set Royalty
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Set Royalty</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={onSubmit}>
              <ModalBody>
                <FormControl
                  id="contractId"
                  isInvalid={!!errors.contractId}
                  py={2}
                >
                  <FormLabel>ContractId</FormLabel>
                  <Input
                    type="contractId"
                    // defaultValue={import.meta.env.VITE_CONTRACT_ID || ''}
                    {...register('contractId', { required: true })}
                  />
                  <FormErrorMessage>Fill this form.</FormErrorMessage>
                </FormControl>
                <FormControl id="tokenId" isInvalid={!!errors.tokenId} py={2}>
                  <FormLabel>TokenId</FormLabel>
                  <Input
                    type="tokenId"
                    {...register('tokenId', { required: true })}
                  />
                  <FormErrorMessage>Fill this form.</FormErrorMessage>
                </FormControl>
                <FormControl
                  id="percentage"
                  isInvalid={!!errors.percentage}
                  py={2}
                >
                  <FormLabel>Percentage</FormLabel>
                  <Input
                    type="percentage"
                    {...register('percentage', { required: true })}
                  />
                  <FormErrorMessage>Fill this form.</FormErrorMessage>
                </FormControl>
                <FormControl id="receiver" isInvalid={!!errors.receiver} py={2}>
                  <FormLabel>Receiver</FormLabel>
                  <Input
                    type="receiver"
                    {...register('receiver', { required: true })}
                  />
                  <FormErrorMessage>Fill this form.</FormErrorMessage>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button p={4} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
        <Text>Current Network: {network}</Text>
        <Text>Your Address: {address}</Text>
        <HStack>
          <Button
            onClick={async () => {
              await changeNetowrk('PolygonMumbai');
            }}
          >
            Connect Mumbai
          </Button>
          <Button
            onClick={async () => {
              await changeNetowrk('PolygonMainnet');
            }}
          >
            Connect Mainnet
          </Button>
        </HStack>
      </VStack>
    </>
  );
}

export default WalletConnect;
