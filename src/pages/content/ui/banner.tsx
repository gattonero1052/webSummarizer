import { useEffect, forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';

export const Banner = forwardRef((props: any, ref) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [scope, animate] = useAnimate();
  const bannerChildRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show: (text, time = 200000) => {
      setVisible(true);
      setText(text);
      if (time > 0) {
        setTimeout(() => setVisible(false), time);
      }
    },
  }));

  useEffect(() => {
    animate(`.banner-text`, visible ? { transform: 'translateY(0)' } : { transform: 'translateY(-100%)' }, {
      duration: 0.3,
      type: 'spring',
    });
  }, [visible]);

  // here we do a dirty hack because
  // - scope must be always present
  // - we need AnimatePresence to wrap a conditional element
  // - the top level element with scope must have auto-fit height and width
  //   so that it doesn't take any space when its conditional child removed
  // so this conditional element can't extend 100% width to its relative parent
  // whose height and width are auto-fit
  // so we need to get the child's dimensions programmatically
  useEffect(() => {
    if (!bannerChildRef.current || !visible) return;
    const { width, height } = bannerChildRef.current.parentElement.parentElement.parentElement.getBoundingClientRect();
    bannerChildRef.current.parentElement.style.width = width;
    bannerChildRef.current.parentElement.style.height = height;
  }, [visible]);

  return (
    <motion.div className={`banner`} ref={scope}>
      <AnimatePresence mode="popLayout">
        {visible ? (
          <motion.div
            className="relative banner-mask"
            onClick={() => setVisible(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <div
              ref={bannerChildRef}
              className={`relative banner-text flex justify-center`}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              {text}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
});
