import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Button,
  Flex,
  Group,
  Radio,
  Table,
  Text,
  TextInput,
  Modal,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useListState } from "@mantine/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import Rows from "@/components/Layout/Project/BoqTable/Rows";
import { makeFlattenTasks, makeTaskData } from "./helper";
import { Task, TaskData } from "./model";

const TestData: TaskData[] = [
  {
    id: "1",
    title: "งานดิน",
    vender: "บริษัทดิน",
    quantity: 500,
    quatUnit: "ลบ.ม",
    materialCost: 20000,
    totalMaterial: 100,
    labourCost: 0,
    totalLabour: 0,
    totalPrice: 200,
    note: "note",
    type: "task",
    subtasks: [
      {
        id: "1.1",
        title: "Subtask 1.1",
        vender: "Vender 1.1",
        quantity: 1,
        quatUnit: "ตร.ม.",
        materialCost: 100,
        totalMaterial: 100,
        labourCost: 100,
        totalLabour: 100,
        totalPrice: 200,
        note: "note",
        type: "subtask",
      },
      {
        id: "1.2",
        title: "Subtask 1.2",
        vender: "Vender 1.2",
        quantity: 1,
        quatUnit: "ตร.ม.",
        materialCost: 100,
        totalMaterial: 100,
        labourCost: 100,
        totalLabour: 100,
        totalPrice: 200,
        note: "note",
        type: "subtask",
      },
    ],
  },
  {
    id: "2",
    title: "Task 2",
    vender: "Vender 2",
    quantity: 1,
    quatUnit: "ตร.ม.",
    materialCost: 100,
    totalMaterial: 100,
    labourCost: 100,
    totalLabour: 100,
    totalPrice: 200,
    note: "note",
    type: "task",
  },
];

export default function BoqTable() {
  const [list, handlers] = useListState<Task>([]);
  const [isChange, setIsChange] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  let tasksData = makeTaskData(list);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    handlers.setState(makeFlattenTasks(TestData));
  }, []);

  useEffect(() => {
    if (isChange) {
      tasksData = makeTaskData(list);
      tasksData.map((task, index) => {
        task.id = `${index + 1}`;
        if (task.subtasks) {
          task.subtasks.map((subtask, subtaskIndex) => {
            subtask.id = `${index + 1}.${subtaskIndex + 1}`;
          });
        }
      });
      const newTasks = makeFlattenTasks(tasksData);
      setIsChange(false);
      handlers.setState(newTasks);
    }
  }, [list]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over?.id);
      if (
        (list[oldIndex].type === "subtask" && newIndex === 0) ||
        // (list[newIndex].type === "subtask" && oldIndex === 0) ||
        (list[oldIndex].type === "subtask" && newIndex === 0)
      ) {
        return;
      }

      const tempList = [...list];
      const [removed] = tempList.splice(oldIndex, 1);
      tempList.splice(newIndex, 0, removed);

      // check if first task is subtask
      if (tempList[0].type === "subtask") return;

      setIsChange(true);
      handlers.reorder({ from: oldIndex, to: newIndex });
    }
  };

  const TaskForm = useForm<Task>({
    initialValues: {
      id: "",
      title: "",
      vender: "",
      quantity: 0,
      quatUnit: "",
      materialCost: 0,
      totalMaterial: 0,
      labourCost: 0,
      totalLabour: 0,
      totalPrice: 0,
      note: "",
      type: "task",
    },
    validate: {
      title: (value) => {
        return value.length <= 0 ?? "กรุณากรอกข้อมูล";
      },
      vender: (value) => {
        return value.length <= 0 ?? "กรุณาเลือกผู้ขาย";
      },
      type: (value) => {
        return value.length <= 0 ?? "กรุณาเลือกประเภท";
      },
    },
  });

  const addTask = (Task: Task): void => {
    let newID = "";
    if (Task.type === "task") {
      if (list.length === 0) {
        newID = "1";
        handlers.append({
          id: newID,
          title: Task.title,
          vender: Task.vender,
          quantity: Task.quantity,
          quatUnit: Task.quatUnit,
          materialCost: Task.materialCost,
          totalMaterial: Task.totalMaterial,
          labourCost: Task.labourCost,
          totalLabour: Task.totalLabour,
          totalPrice: Task.totalPrice,
          note: Task.note,
          type: "task",
        });
        return;
      }
      const beforeID = list[list.length - 1].id.split(".");
      newID = `${parseInt(beforeID[0]) + 1}`;
      handlers.append({
        id: newID,
        title: Task.title,
        vender: Task.vender,
        quantity: Task.quantity,
        quatUnit: Task.quatUnit,
        materialCost: Task.materialCost,
        totalMaterial: Task.totalMaterial,
        labourCost: Task.labourCost,
        totalLabour: Task.totalLabour,
        totalPrice: Task.totalPrice,
        note: Task.note,
        type: "task",
      });
    } else {
      const beforeID = list[list.length - 1].id.split(".");
      // if is first subtask
      if (beforeID.length === 1) {
        handlers.append({
          id: `${beforeID[0]}.1`,
          title: Task.title,
          vender: Task.vender,
          quantity: Task.quantity,
          quatUnit: Task.quatUnit,
          materialCost: Task.materialCost,
          totalMaterial: Task.totalMaterial,
          labourCost: Task.labourCost,
          totalLabour: Task.totalLabour,
          totalPrice: Task.totalPrice,
          note: Task.note,
          type: "subtask",
        });
        return;
      }
      newID = `${beforeID[0]}.${parseInt(beforeID[1]) + 1}`;
      handlers.append({
        id: newID,
        title: Task.title,
        vender: Task.vender,
        quantity: Task.quantity,
        quatUnit: Task.quatUnit,
        materialCost: Task.materialCost,
        totalMaterial: Task.totalMaterial,
        labourCost: Task.labourCost,
        totalLabour: Task.totalLabour,
        totalPrice: Task.totalPrice,
        note: Task.note,
        type: "subtask",
      });
    }
  };

  const removeTask = (id: string, index: number): void => {
    if (list.length === 1) {
      handlers.filter((task) => task.id !== id);
      setIsChange(true);
      return;
    }
    if (index === 0 && list[index + 1].type === "subtask") {
      console.log("not allow remove first task");
      return;
    }
    handlers.filter((task) => task.id !== id);
    setIsChange(true);
  };

  return (
    <>
      <Head>
        <title>BOQ Table | Connetwork</title>
      </Head>
      <Flex mt="lg" mb="xl" p="md" justify="flex-end" gap="md">
        <Button color="green" onClick={open}>
          เพิ่มรายการงาน
        </Button>
        <Button
          disabled={list.length <= 0}
          color="red"
          onClick={() => {
            handlers.setState([]);
          }}
        >
          ลบข้อมูล
        </Button>
        <Button disabled={list.length <= 0}>ออกใบ Requirement</Button>
      </Flex>

      {/* Modal to add List */}
      <Modal opened={opened} onClose={close} title="เพิ่มรายการงาน">
        <form
          onSubmit={TaskForm.onSubmit((values) => {
            addTask(values);
            close();
            TaskForm.reset();
          })}
        >
          <Flex direction="column" gap="md">
            <Radio.Group
              label={"ประเภทงาน"}
              description={"เลือกประเภทงานที่ต้องการ"}
              name={"taskType"}
              withAsterisk
              sx={{ flexGrow: 1 }}
              {...TaskForm.getInputProps("type")}
            >
              <Group mt={"xs"}>
                <Radio label={"หัวข้อหลัก"} value={"task"} />
                <Radio
                  label={"หัวข้อย่อย"}
                  value={"subtask"}
                  disabled={list.length == 0}
                />
              </Group>
            </Radio.Group>
            <TextInput
              label={"ชื่องาน"}
              withAsterisk
              {...TaskForm.getInputProps("title")}
            />
            <TextInput
              label={"รายละเอียด"}
              withAsterisk
              {...TaskForm.getInputProps("description")}
            />
            <TextInput label={"หมายเหตุ"} {...TaskForm.getInputProps("note")} />
            <Flex justify="flex-end">
              <Button
                w={"10em"}
                variant="gradient"
                gradient={{
                  from: "indigo.9",
                  to: "red.4",
                }}
                type={"submit"}
              >
                เพิ่มรายการ
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>

      {/* TOR(Table of requirement) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        autoScroll={true}
      >
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ width: "1rem" }}></th>
              <th style={{ textAlign: "center" }}>ลำดับ</th>
              <th style={{ textAlign: "center" }}>รายการ</th>
              <th style={{ textAlign: "center" }}>บริษัท</th>
              <th style={{ textAlign: "center" }}>ปริมาณ</th>
              <th style={{ textAlign: "center" }}>ค่าวัสดุ</th>
              <th style={{ textAlign: "center" }}>รวม</th>
              <th style={{ textAlign: "center" }}>ค่าแรง</th>
              <th style={{ textAlign: "center" }}>รวม</th>
              <th style={{ textAlign: "center" }}>ราคารวม</th>
            </tr>
          </thead>
          {list.length > 0 ? (
            <tbody>
              <SortableContext
                items={list}
                strategy={verticalListSortingStrategy}
              >
                {list.map((task, index) => (
                  <Rows
                    id={task.id}
                    title={task.title}
                    vender={task.vender}
                    quantity={task.quantity}
                    quatUnit={task.quatUnit}
                    materialCost={task.materialCost}
                    totalMaterial={task.totalMaterial}
                    labourCost={task.labourCost}
                    totalLabour={task.totalLabour}
                    totalPrice={task.totalPrice}
                    note={task.note}
                    type={task.type}
                    index={index}
                    removeTask={removeTask}
                    key={task.id}
                  />
                ))}
              </SortableContext>
            </tbody>
          ) : (
            <tfoot>
              <tr>
                <td colSpan={12} align="center">
                  <Text fz={"1rem"} m={"xl"}>
                    ไม่พบข้อมูลขอบเขตงาน
                  </Text>
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </DndContext>
    </>
  );
}
