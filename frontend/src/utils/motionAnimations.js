export const todoListAnimation = {
    initial: { scale: 0.8, opacity: 0, y: 30 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 1, opacity: 0, x: 100 },
    transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.4,

    }
}