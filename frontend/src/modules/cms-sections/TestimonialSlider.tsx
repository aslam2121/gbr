"use client";

import { useState } from "react";
import { type PageSection, type TestimonialItem } from "@/types/page-section";

interface TestimonialSliderProps {
  section: PageSection;
}

export function TestimonialSlider({ section }: TestimonialSliderProps) {
  const testimonials =
    (section.metadata as { testimonials?: TestimonialItem[] })?.testimonials ?? [];
  const [current, setCurrent] = useState(0);

  if (testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {section.title && (
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="mt-4 text-center text-lg text-gray-600">
            {section.subtitle}
          </p>
        )}

        <div className="relative mt-12">
          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 sm:p-12">
            <svg className="h-8 w-8 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>

            <blockquote className="mt-6 text-xl leading-relaxed text-gray-800 sm:text-2xl">
              {testimonials[current].quote}
            </blockquote>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {testimonials[current].name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonials[current].name}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonials[current].role}, {testimonials[current].company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === current ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
