import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cómo se verifican los cuidadores?",
      answer: "Todos los cuidadores pasan por un riguroso proceso que incluye verificación de identidad, check de antecedentes, entrevistas personalizadas y evaluación de experiencia previa con mascotas."
    },
    {
      question: "¿Puedo elegir al mismo cuidador siempre?",
      answer: "Sí, puedes marcar cuidadores como favoritos y solicitar sus servicios de manera recurrente. Muchos de nuestros usuarios establecen relaciones a largo plazo con sus cuidadores preferidos."
    },
    {
      question: "¿Qué pasa en caso de emergencia?",
      answer: "Todos los cuidadores tienen acceso a veterinarios de emergencia y están entrenados en primeros auxilios para mascotas. Te mantendremos informado inmediatamente sobre cualquier situación."
    },
    {
      question: "¿Cómo funcionan los pagos?",
      answer: "El pago se realiza de forma segura a través de la plataforma y se libera al completarse el servicio satisfactoriamente. Aceptamos tarjetas de crédito, débito y transferencias bancarias."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600">
            Respuestas a las dudas más comunes sobre nuestros servicios
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} hover className="overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;