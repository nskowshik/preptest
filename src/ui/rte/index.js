import Button from "@mui/material/Button";
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
} from "mui-tiptap";
import { useRef } from "react";

function RichEditor({ content = "<p>Hello world</p>", onContentChange }) {
    const rteRef = useRef(null);

    return (
        <RichTextEditor
            ref={rteRef}
            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
            content={content}
            renderControls={() => (
                <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                </MenuControlsContainer>
            )}
            onContentChange={onContentChange}
        />
    );
}

export default RichEditor;
