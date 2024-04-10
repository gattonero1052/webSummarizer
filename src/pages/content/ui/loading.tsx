import { useEffect, forwardRef } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { IconLoading } from '../../../shared/icon';

export const Loading = ({ isLoading = false }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(`.loading-mask`, isLoading ? { backdropFilter: 'blur(5px)' } : { backdropFilter: 'blur(0px)' }, {
      duration: 0.3,
    });
  }, [isLoading]);

  return (
    <motion.div
      ref={scope}
      className={`loading`}
      style={{
        display: isLoading ? 'flex' : 'none',
      }}>
      <div className="loading-mask"></div>
      {isLoading ? (
        <motion.div
          className="loading-spinner flex h-auto justify-center items-center"
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}>
          <IconLoading />
        </motion.div>
      ) : null}
    </motion.div>
  );
};
