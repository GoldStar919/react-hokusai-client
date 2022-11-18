import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Center,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Spinner,
  Link,
  Text,
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';
import { genPolygonscanUrl, TxObj } from '../utils/Poygonscan';

type FormValues = {
  apiKey: string;
  contractId: string;
  toAddress: string;
  tokenUris: string;
};

function MintForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isConnected, network } = useContext(WalletContext);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const baseUrl =
    network === 'PolygonMainnet' ? 'polygon.hokusai.app' : 'api.hokusai.app';

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsLoading(true);
    setIsConfirmed(true);
    const tokenArr = values.tokenUris.split('\n');
    const mintBody: { to: string; tokenURI: string }[] = [];
    tokenArr.forEach((item) => {
      mintBody.push({
        to: values.toAddress,
        tokenURI: item,
      });
    });
    await fetch(
      `https://${baseUrl}/v2/polygon-mumbai/nft/2/${values.contractId}/mint?key=${values.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(mintBody),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('resss', res);
        setResponse(genPolygonscanUrl(res as TxObj, network));
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
    setIsLoading(false);
  });

  const reset = () => {
    setError('');
    setIsConfirmed(false);
  };

  return isConfirmed ? (
    <>
      <Center>
        <Stack direction="column" align="center">
          {isLoading && <Spinner />}
          <Link isExternal href={response}>
            {response}
          </Link>
          {error && <Text>error</Text>}
          <Button onClick={() => reset()}>Back</Button>
        </Stack>
      </Center>
    </>
  ) : (
    <>
      <Stack
        width="100%"
        direction="column"
        spacing="10px"
        borderRadius="20px"
        p="30px"
        align="center"
      >
        <form onSubmit={onSubmit} style={{ width: '60%' }}>
          <FormControl id="apiKey" isInvalid={!!errors.apiKey} py={2}>
            <FormLabel>apiKey</FormLabel>
            <Input
              // defaultValue={import.meta.env.VITE_HOKUSAI_API_KEY || ''}
              type="apiKey"
              {...register('apiKey', { required: true })}
            />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>
          <FormControl id="contractId" isInvalid={!!errors.contractId} py={2}>
            <FormLabel>contractId</FormLabel>
            <Input
              type="contractId"
              // defaultValue={import.meta.env.VITE_CONTRACT_ID || ''}
              {...register('contractId', { required: true })}
            />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>

          <FormControl id="toAddress" isInvalid={!!errors.toAddress} py={2}>
            <FormLabel>toAddress</FormLabel>
            <Input
              type="toAddress"
              {...register('toAddress', { required: true })}
            />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>
          <FormControl id="tokenUris" isInvalid={!!errors.tokenUris} py={2}>
            <FormLabel>Metadata URL(.json)</FormLabel>
            <Textarea {...register('tokenUris', { required: true })} />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>

          <Center>
            <Button p={4} type="submit" isDisabled={!isConnected}>
              Submit
            </Button>
          </Center>
        </form>
      </Stack>
    </>
  );
}

export default MintForm;
