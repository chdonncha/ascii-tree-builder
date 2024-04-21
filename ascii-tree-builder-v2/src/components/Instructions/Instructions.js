import React from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './Instructions.scss';

export const InstructionsAccordion = () => (
  <div className="instructions-container">
    <div>
      <Accordion className="accordion-styling">
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon className="accordion-color" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>
            <u>
              <b>Instructions</b>
            </u>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {/*<Hotkeys />*/}
            <GeneralInstructions />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  </div>
);

export const GeneralInstructions = () => (
  <div>
    <div className="instruction-spacing">
      <strong>Manipulating Structure:</strong> Use the arrow buttons (↑, ↓, ←,
      →) to adjust the position and indentation of your selected tree item.
    </div>
    <div className="instruction-spacing">
      <strong>Editing:</strong> Click 'Add Node' to add a new item, 'Delete
      Node' to remove an item and its children, 'Rename Node' to modify its
      name, or 'Clear' to delete all items in the entire tree.
    </div>
    <div className="instruction-spacing">
      <strong>Undo/Redo:</strong> Made a mistake? Utilise the 'Undo' and 'Redo'
      buttons to navigate your recent changes.
    </div>
    <div className="instruction-spacing">
      <strong>ASCII Format:</strong> Once satisfied, view and copy your tree in
      ASCII format for documentation or future reference.
    </div>
    <div className="instruction-spacing">
      <strong>Importing:</strong> To continue working on a structure, paste the
      copied ASCII text into the Import Tree section.
    </div>
  </div>
);

export const Hotkeys = () => (
  <div>
    <strong>Hotkeys:</strong>
    <ul>
      <li>
        <strong>Navigation:</strong> Use the ↑/↓ arrow keys to navigate through
        the items.
      </li>
      <li>
        <strong>Move Items:</strong> Hold 'Ctrl' and use the ↑/↓ arrow keys to
        move items up or down.
      </li>
    </ul>
  </div>
);

const Instructions = () => (
  <>
    <InstructionsAccordion />
  </>
);

export default Instructions;
