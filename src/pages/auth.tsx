import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Box,
  Anchor,
  Stack,
  Center,
  Card,
} from '@mantine/core';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/supabase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AuthError } from '@supabase/supabase-js';



export default function Auth(props: PaperProps) {
  const supabase = createClientComponentClient<Database>();
  const [isMainButtonDisabled, setIsMainButtonDisabled] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
  const { push } = useRouter();
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  async function signInWithPassword(email: string, password: string) {
    setIsMainButtonDisabled(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsMainButtonDisabled(false);
    if (error) {
      setError(error);
    } else {
      push('/home');
    }
  }

  return (
    <Center h={'100vh'} mx="auto">
      <Card withBorder p={'xl'}>
        <Stack>
          <form onSubmit={form.onSubmit((v) => {
            signInWithPassword(v.email, v.password);
          })}>
            <Text size="lg" weight={500}>
              Welcome to TalkForm.ai
            </Text>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="hello@email.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="md"
              />
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type="submit" radius="xl" loading={isMainButtonDisabled}>
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Stack>
      </Card>
    </Center>
  );
}