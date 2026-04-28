// Targets: layouts/index.html
// Elements: #progress-steps, .step, .step-circle, .step-line

document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".step"));
  if (!steps.length) return;

  const activateCircle = (circle) => {
    if (!circle) return;
    circle.classList.remove(
      "bg-neutral-50",
      "text-neutral-700",
      "border-neutral-300",
    );
    circle.classList.add(
      "bg-primary-500",
      "text-neutral-50",
      "border-primary-500",
    );
  };

  const deactivateCircle = (circle) => {
    if (!circle) return;
    circle.classList.add(
      "bg-neutral-50",
      "text-neutral-700",
      "border-neutral-300",
    );
    circle.classList.remove(
      "bg-primary-500",
      "text-neutral-50",
      "border-primary-500",
    );
  };

  const onScroll = () => {
    const triggerPoint = window.innerHeight / 2;

    steps.forEach((step, i) => {
      const circle = step.querySelector(".step-circle");
      const line = step.querySelector(".step-line");
      const stepRect = step.getBoundingClientRect();
      const nextStep = steps[i + 1];

      // Activate circle when step top crosses trigger point
      if (stepRect.top <= triggerPoint) {
        activateCircle(circle);
      } else {
        deactivateCircle(circle);
      }

      // Grow line between this step and the next
      if (line && nextStep) {
        const nextCircle = nextStep.querySelector(".step-circle");
        const lineRect = line.getBoundingClientRect();
        const nextCircleRect = nextCircle?.getBoundingClientRect();

        if (!nextCircleRect) return;

        const lineTop = lineRect.top + window.scrollY;
        const lineBottom = nextCircleRect.top + window.scrollY;
        const totalHeight = lineBottom - lineTop;

        const scrollProgress =
          (window.scrollY + triggerPoint - lineTop) / totalHeight;
        const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

        line.style.height = `${clampedProgress * totalHeight}px`;
        line.style.backgroundColor =
          clampedProgress > 0 ? "rgb(var(--color-primary-500))" : "";
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
