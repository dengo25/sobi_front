
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import faqIconQ from "../../assets/icons/ico-faq-q.svg";
import faqIconA from "../../assets/icons/ico-faq-a.svg";
import CustomCheckbox from "../input/CustomCheckbox"

const ControlledAccordions = ({name, title, content, expanded, handleChange, faqNo, isChecked, onCheckToggle}) => {
  return (
    <div>
      <Accordion expanded={expanded === name} onChange={handleChange(name)}>
        <AccordionSummary
          aria-controls={`${name}bh-content`}
          id={`${name}bh-header`}
        >
          <CustomCheckbox
            checked={isChecked}
            onChange={() => onCheckToggle(faqNo)}
            size="medium"
            color='success'
          />
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