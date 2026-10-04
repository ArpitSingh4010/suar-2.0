import { AnimatePresence, motion } from "framer-motion";
import { GoldParticles } from "./GoldParticles";

const LABEL = { location: "GOA", dress: "THE DRESS CODE", sufi: "5TH DECEMBER", daysix: "6TH DECEMBER" };

export const TabTransition = ({ target }) => (
  <AnimatePresence>
    {target && (
      <motion.div
        key={target}
        className={`tab-transition theme-${target}`}
        data-testid="tab-transition"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
        aria-hidden="true"
      >
        <motion.div
          className="tt-desaturate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="tt-fill"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(125% at 50% 50%)" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
        >
          {target === "sufi" && <GoldParticles count={90} />}
          <motion.span
            className="tt-label font-display"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
          >
            {LABEL[target]}
          </motion.span>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
