import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import CustomCheckbox from "../input/CustomCheckbox"

import faqIconQ from "../../assets/icons/ico-faq-q.svg";
import faqIconA from "../../assets/icons/ico-faq-a.svg";


const ControlledAccordions = ({
  name, 
  title, 
  content, 
  expanded, 
  handleChange, 
  faqNo, 
  isChecked, 
  onCheckToggle,
  isAdmin
}) => {
  return (
    <div>
      <Accordion expanded={expanded === name} onChange={handleChange(name)}>
        <AccordionSummary
          aria-controls={`${name}bh-content`}
          id={`${name}bh-header`}
        >
          {isAdmin && (
            <CustomCheckbox
              checked={isChecked}
              onChange={() => onCheckToggle(faqNo)}
              onClick={(e) => e.stopPropagation()} // 아코디언 열림 방지
              onFocus={(e) => e.stopPropagation()}
              size="medium"
              color='success'
            />
          )}
          <img src={faqIconQ}/>{title}
        </AccordionSummary>
        <AccordionDetails>
          <img src={faqIconA}/>{content}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default ControlledAccordions;