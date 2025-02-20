"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStepStore } from "@/store/use-step-store"
import { motion } from "framer-motion"

export function MultiStepForm({ children }: { children: React.ReactNode[] }) {
  const { currentStep, steps, setCurrentStep, markStepCompleted } = useStepStore()

  const next = async () => {
    markStepCompleted(currentStep)
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
  }

  const prev = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border ${
                    index <= currentStep ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-[2px] w-16 bg-gray-200">
                    <div
                      className="h-full bg-teal-500 transition-all"
                      style={{
                        width: index < currentStep ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-semibold mt-4">{steps[currentStep]}</h2>
        </div>

        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
        >
          {children[currentStep]}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={next}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  )
} 