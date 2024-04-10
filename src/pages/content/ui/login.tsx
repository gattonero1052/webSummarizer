import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useCycle,
  animate,
  useAnimate,
  stagger,
  AnimatePresence,
} from 'framer-motion';
import { Button } from '@nextui-org/button';
import { Input, cn } from '@nextui-org/react';
import '../../../assets/font/LTInstitute-1.otf';
import {
  IconEyeFilled,
  IconEyeSlashFilled,
  IconLoading,
  IconSelect,
  IconScreenshot,
  IconCollapse,
  IconExpand,
  IconGithub,
  IconGoogle,
  IconClose,
} from '../../../shared/icon';
import { Banner } from './banner';
import { Loading } from './loading';
import { Colors, validateEmail, validatePassword } from './utils';
import { useBanner, useRequestBackend } from './hooks';

export const Login = ({ isLoginOpen, onSuccess, onClose, yPos }) => {
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(pwd);
  const [bannerRef, showMessage] = useBanner();
  const [isLoading, requestBackend] = useRequestBackend(() => {
    showMessage('Request time out');
  });
  const loginOrRegister = useCallback(() => {
    if (!isEmailValid || !isPasswordValid) {
      setShowEmailError(true);
      setShowPasswordError(true);
      return;
    }

    requestBackend(
      {
        request: 'loginOrRegister',
        data: {
          userName: email,
          password: pwd,
        },
      },
      () => {
        // TODO set user info from jwt
        // TODO switch to main panel
      },
    );
  }, [isEmailValid, isPasswordValid, setShowEmailError, setShowPasswordError]);

  const forgetPassword = useCallback(() => {
    if (!isEmailValid || !isPasswordValid) {
      setShowEmailError(true);
      return;
    }

    requestBackend(
      {
        request: 'forgetPassword',
        data: {
          userName: email,
        },
      },
      () => {
        // TODO forget password
        showMessage('Password reset email is sent, please take a look at your emailbox.');
      },
      () => {
        showMessage("Email haven't been registered yet, you can fill in the password to register.");
      },
    );
  }, [setShowEmailError]);

  return (
    <AnimatePresence mode="popLayout">
      {isLoginOpen ? (
        <motion.div
          className={`login-wrapper w-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ top: yPos }}>
          <Banner ref={bannerRef} />
          <Loading isLoading={isLoading} />
          <div className="absolute close cursor-pointer" onClick={() => onClose()}>
            <IconClose fill={Colors.icon} />
          </div>
          <div className="input-wrapper w-full">
            <Input
              classNames={{
                input: 'primary-text-color',
                inputWrapper: 'tertiary-color',
                label: 'primary-text-color font-bold',
              }}
              fullWidth={true}
              color="primary"
              labelPlacement="outside"
              isClearable
              isRequired
              variant="bordered"
              value={email}
              onValueChange={setEmail}
              type="email"
              label="Email"
              errorMessage={showEmailError && !isEmailValid ? 'Please enter a valid email' : ''}
              size="sm"
            />
          </div>
          <div className="input-wrapper w-full">
            <Input
              classNames={{
                input: 'primary-text-color',
                label: 'primary-text-color font-bold',
              }}
              value={pwd}
              onValueChange={setPwd}
              fullWidth={true}
              labelPlacement="outside"
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              size="sm"
              errorMessage={
                showPasswordError && !isPasswordValid
                  ? 'Please enter a valid password (at least 8 characters, containing at least one uppercase letter, one lowercase letter, one number, and one special character only among #_@$!%*?&)'
                  : ''
              }
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsPwdVisible(v => !v)}>
                  {isPwdVisible ? (
                    <IconEyeSlashFilled className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IconEyeFilled className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isPwdVisible ? 'text' : 'password'}
              className="max-w-xs"
            />
          </div>
          <div className="input-wrapper mt-2 flex gap-2">
            <Button className="font-bold" size="sm" color="primary" variant="shadow" onClick={loginOrRegister}>
              Login / Register
            </Button>
            <Button className="font-bold" size="sm" color="secondary" variant="shadow" onClick={forgetPassword}>
              Forget Password
            </Button>
          </div>
          <div className="input-wrapper w-full mt-2 flex flex-col gap-3">
            <Button
              className="font-bold"
              startContent={<IconGoogle />}
              fullWidth={true}
              size="sm"
              color="default"
              variant="shadow"
              onClick={() => {}}>
              Continue With Google
            </Button>
            <Button
              className="font-bold"
              startContent={<IconGithub />}
              fullWidth={true}
              size="sm"
              color="default"
              variant="shadow"
              onClick={async () => {
                const subWindowUrl = 'http://localhost:3000/auth/github/callback';
                window.open(subWindowUrl, 'Sub Window', 'width=600,height=400');
              }}>
              Continue With Github
            </Button>
            <Button
              className="font-bold"
              fullWidth={true}
              size="sm"
              color="primary"
              variant="shadow"
              onClick={() => {
                requestBackend({
                  request: 'loginOrRegister',
                  data: {
                    userName: 'free',
                    password: 'account',
                  },
                });
              }}>
              Try it
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
