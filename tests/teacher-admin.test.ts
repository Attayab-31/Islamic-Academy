import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { createTeacherUser } from "../src/lib/auth";
import { deleteTeacherAndLogin } from "../src/lib/teacher-admin";

test("teacher login creation and deletion stay consistent", async () => {
    const email = `teacher-${Date.now()}@example.com`;

    const createdUser = await createTeacherUser({
        name: "Test Teacher",
        email,
        password: "strong-password-123",
    });

    assert.equal(createdUser.email, email);

    const teacher = await prisma.teacher.findFirst({
        where: { email },
    });

    assert.ok(teacher);
    assert.equal(teacher.userId, createdUser.id);

    const deleted = await deleteTeacherAndLogin(teacher.id);
    assert.equal(deleted, true);

    const userAfterDelete = await prisma.user.findUnique({ where: { id: createdUser.id } });
    assert.equal(userAfterDelete, null);

    const teacherAfterDelete = await prisma.teacher.findUnique({ where: { id: teacher.id } });
    assert.equal(teacherAfterDelete, null);
});
