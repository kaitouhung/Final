const { Kafka } = require("kafkajs");
const bycrypt = require("bcrypt");
const { User } = require("./models/user.model");
const { userRole } = require("./constant/user");
const brokers = ["localhost:9092"];

const seedAdminAccountProducer = async () => {
  const clientId = "seeding-admin-account-client-id";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = kafka.producer();

  await producer.connect();
  const userList = await User.find();
  if (userList.length === 0) {
    const password = await bycrypt.hash("123456", Number(process.env.SALT));
    await producer.connect();

    const admin = await User.create({
      username: "Admin",
      email: "adminnews@yopmail.com",
      password,
      role: userRole.admin,
      status: true,
    });
    await producer.send({
      topic: "seed-admin-account",
      messages: [{ value: JSON.stringify(admin) }],
    });
  }
  await producer.disconnect();
};

const updateUserStatusProducer = async (data) => {
  await producer.connect();
  await producer.send({
    topic: "update-user-status",
    messages: [{ value: JSON.stringify(data) }],
  });
  await producer.disconnect();
};

module.exports = {
  updateUserStatusProducer,
  seedAdminAccountProducer,
};
