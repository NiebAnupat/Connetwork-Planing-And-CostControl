import { ActionIcon, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/pages/AllProject/BoqTable/model";

interface props extends Task {
  index: number;
  removeTask: (id: string, index: number) => void;
}
export default function Rows({
  id,
  title,
  vender,
  quantity,
  quatUnit,
  materialCost,
  totalMaterial,
  labourCost,
  totalLabour,
  totalPrice,
  note,
  type,
}: props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: type === "subtask" ? "#EFEFEF" : undefined,
    transition,
  };

  if (type === "task") {
    return (
      <>
        <tr key={id} ref={setNodeRef} style={style}>
          <td>
            <ActionIcon {...attributes} {...listeners}>
              <IconGripVertical size="1.5rem" stroke={1.5} />
            </ActionIcon>
          </td>
          <td>
            <Text weight={900} align={"center"} fz={".85rem"}>
              {id}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {title}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"}>
              {vender}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {quantity + " " + quatUnit}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {materialCost}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {totalMaterial}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {labourCost}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {totalLabour}
            </Text>
          </td>
          <td>
            <Text weight={900} fz={".85rem"} align="center">
              {totalPrice}
            </Text>
          </td>
        </tr>
      </>
    );
  } else {
    return (
      <tr key={id} ref={setNodeRef} style={style}>
        <td>
          <ActionIcon {...attributes} {...listeners}>
            <IconGripVertical size="1rem" stroke={1.5} />
          </ActionIcon>
        </td>
        <td>
          <Text weight={500} align={"center"} fz={".85rem"}>
            &emsp;{id}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            &emsp;{title}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"}>
            {vender}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {quantity + " " + quatUnit}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {materialCost}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {totalMaterial}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {labourCost}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {totalLabour}
          </Text>
        </td>
        <td>
          <Text weight={500} fz={".85rem"} align="center">
            {totalPrice}
          </Text>
        </td>
      </tr>
    );
  }
}
