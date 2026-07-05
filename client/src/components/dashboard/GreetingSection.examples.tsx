import * as React from "react";
import { GreetingSection } from "./GreetingSection";

/**
 * GreetingSection Examples
 * Demonstrates different configurations and use cases
 */

export default function GreetingSectionExamples() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900">
      <div>
        <h2 className="text-2xl font-bold mb-4">GreetingSection Examples</h2>
      </div>

      {/* Example 1: Default (Morning) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Morning Greeting</h3>
        <GreetingSection
          userName="João Silva Santos"
          currentDate={new Date(2024, 0, 15, 8, 30)}
        />
      </div>

      {/* Example 2: Afternoon */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Afternoon Greeting</h3>
        <GreetingSection
          userName="Maria Santos"
          currentDate={new Date(2024, 0, 15, 14, 30)}
        />
      </div>

      {/* Example 3: Evening */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Evening Greeting</h3>
        <GreetingSection
          userName="Pedro Oliveira"
          currentDate={new Date(2024, 0, 15, 20, 30)}
        />
      </div>

      {/* Example 4: Center Aligned */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Center Aligned</h3>
        <GreetingSection
          userName="Ana Costa"
          currentDate={new Date(2024, 0, 15, 10, 30)}
          align="center"
        />
      </div>

      {/* Example 5: With Glass Effect */}
      <div>
        <h3 className="text-lg font-semibold mb-2">With Glass Effect</h3>
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "32px",
            borderRadius: "16px",
          }}
        >
          <GreetingSection
            userName="Carlos Rodrigues"
            currentDate={new Date(2024, 0, 15, 10, 30)}
            showGlassEffect={true}
          />
        </div>
      </div>

      {/* Example 6: Single Name */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Single Name</h3>
        <GreetingSection
          userName="Isabella"
          currentDate={new Date(2024, 0, 15, 9, 0)}
        />
      </div>

      {/* Example 7: Different Dates */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Different Dates</h3>
        <div className="space-y-4">
          <GreetingSection
            userName="Lucas"
            currentDate={new Date(2024, 0, 14, 10, 0)} // Sunday
          />
          <GreetingSection
            userName="Lucas"
            currentDate={new Date(2024, 5, 25, 10, 0)} // June
          />
          <GreetingSection
            userName="Lucas"
            currentDate={new Date(2024, 11, 25, 10, 0)} // December
          />
        </div>
      </div>

      {/* Example 8: Responsive - Mobile Simulation */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Mobile Viewport (Center Aligned)</h3>
        <div className="max-w-sm mx-auto border-4 border-gray-300 rounded-2xl p-4">
          <GreetingSection
            userName="Sofia Almeida"
            currentDate={new Date(2024, 0, 15, 11, 30)}
            align="center"
          />
        </div>
      </div>

      {/* Example 9: All Time Periods */}
      <div>
        <h3 className="text-lg font-semibold mb-2">All Time Periods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">5:00 AM - Morning Start</p>
            <GreetingSection
              userName="Rafael"
              currentDate={new Date(2024, 0, 15, 5, 0)}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">12:00 PM - Afternoon Start</p>
            <GreetingSection
              userName="Rafael"
              currentDate={new Date(2024, 0, 15, 12, 0)}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">6:00 PM - Evening Start</p>
            <GreetingSection
              userName="Rafael"
              currentDate={new Date(2024, 0, 15, 18, 0)}
            />
          </div>
        </div>
      </div>

      {/* Example 10: Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
        <GreetingSection
          userName="Beatriz Lima"
          currentDate={new Date(2024, 0, 15, 10, 30)}
          className="border-2 border-orange-500 shadow-xl"
        />
      </div>
    </div>
  );
}
