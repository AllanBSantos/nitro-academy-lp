"use client";

import { useState } from "react";

export default function TimeSelectionSection() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const schedules = [
    {
      day: "Segundas-feiras",
      time: "11:30",
      startDate: "04/05/25",
      endDate: "04/06/25",
    },
    {
      day: "Terças-feiras",
      time: "14:00",
      startDate: "05/05/25",
      endDate: "05/06/25",
    },
    {
      day: "Quartas-feiras",
      time: "15:30",
      startDate: "06/05/25",
      endDate: "06/06/25",
    },
    {
      day: "Quintas-feiras",
      time: "16:00",
      startDate: "07/05/25",
      endDate: "07/06/25",
    },
  ];

  return (
    <section className="w-full bg-[#1e1b4b] py-16 -mt-[48px]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-white text-2xl mb-2">Apenas</h2>
        <div className="text-white text-6xl font-bold mb-4">R$ 35,59</div>
        <p className="text-white text-xl mb-8">
          em 3x sem juros ou R$99,99 á vista.
        </p>

        <p className="text-white text-xl mb-6">
          <span className="font-bold">Selecione</span> o melhor horário e clique
          em &ldquo;<span className="font-bold">ADICIONAR AO CARRINHO</span>
          &rdquo;
        </p>

        <div className="space-y-4 max-w-md mx-auto mb-8">
          {schedules.map((schedule) => (
            <button
              key={`${schedule.day}-${schedule.time}`}
              onClick={() =>
                setSelectedTime(`${schedule.day}-${schedule.time}`)
              }
              className={`w-full py-4 px-8 rounded-[24px] text-xl font-medium transition-colors duration-300 ${
                selectedTime === `${schedule.day}-${schedule.time}`
                  ? "bg-orange-600 text-white"
                  : "border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
              }`}
            >
              <div className="flex flex-col items-center">
                <div>
                  {schedule.day} {schedule.time}
                </div>
                <div className="text-sm mt-1">
                  Data início: {schedule.startDate} Data Fim: {schedule.endDate}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button className="bg-orange-600 text-[#1e1b4b] text-xl font-bold py-4 px-8 rounded-[24px] hover:bg-orange-500 transition-colors duration-300 w-full max-w-md">
          ADICIONAR AO CARRINHO
        </button>
      </div>
    </section>
  );
}
