import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function LaciTanya() {
  return (
    <>
      <div className=" flex flex-col items-start w-full">
        <h1 className="font-bold mb-4 container px-20  text-5xl text-dark">Pertanyaan Yang <br />Sering Diajukan</h1>
        <Accordion type="single" collapsible className="w-full container px-36">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium flex items-center justify-between">
              Apakah Semua Trip Disini Aman?
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero nemo suscipit accusamus autem atque minima quae itaque totam quis quibusdam!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium flex items-center justify-between">
              Apakah Trip ini Aman
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit omnis hic optio qui nihil soluta fugiat recusandae quod aliquam doloremque.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium flex items-center justify-between">
              Bagaimana Kebijakan Pembatalan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </AccordionTrigger>
            <AccordionContent>
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt recusandae dolores nulla quaerat tempora, cumque temporibus iusto! Eius, et autem!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}
