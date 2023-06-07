import { Sequelize, DataTypes, DATE, TIME, FLOAT } from "sequelize";
import bcrypt from "bcrypt";

//Instantiate the database (in-memory for now)
export const sequelize = new Sequelize("sqlite::memory:");

//Define bird model
console.log("Defining model...");
export const Birds = sequelize.define("Birds", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subspecies: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  order: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  redList: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

//Define observation model
console.log("Defining model...");
export const Observations = sequelize.define("Observation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

//Define location model
export const Locations = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

//Define user model
console.log("Defining model...");
export const Users = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  password: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Image Model
export const Images = sequelize.define("Images", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//Set up associations
Birds.hasMany(Observations, { as: "observations", foreignKey: "birdId" });
Observations.belongsTo(Birds, { as: "bird", foreignKey: "birdId" });

Birds.hasMany(Images, { as: "images", foreignKey: "birdId" });
Images.belongsTo(Birds, { as: "bird", foreignKey: "birdId" });

Observations.hasOne(Images);
Images.belongsTo(Observations);

Users.hasMany(Observations);
Observations.belongsTo(Users);

Observations.hasOne(Locations);
Locations.belongsTo(Observations);

export function createDatabase() {
  //Test the connection
  console.log("Testing connection...");
  async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  testConnection();

  //Sync database
  console.log("Syncing database...");
  sequelize
    .sync()
    .then(() => {
      console.log("Database synchronized");
      createTestUsers();
      createTestBirds();
      createTestObservations();
      createTestLocations();
      createTestImages();
    })
    .catch((error) => {
      console.error("Unable to synchronize the database:", error);
    });

  //Create test data
  function createTestBirds() {
    console.log("Creating birds...");
    Birds.create({
      species: "Blåhals",
      subspecies: "Sydlig Blåhals",
      order: "Spurvefugl",
      redList: "LC",
      description:
        "Blåhals (Luscinia svecica) er en mindre spurvefugl, der yngler i store dele af Eurasien samt det nordvestlige Alaska. Hannen er kraftigt blå på bryst og strube med varierende sorte, rødbrune og hvide tegninger alt efter underart. Den er en nær slægtning til nattergalen. Arten forekommer som to underarter i Danmark, nordlig blåhals (subsp. svecica) og sydlig blåhals (subsp. cyanecula). Den nordlige blåhals er normalt en fåtallig trækgæst i moseterræn fra de skandinaviske fjeldbirkeskove, mens sydlig blåhals er en fåtallig ynglefugl i marsklandet i Sydvestjylland. Nordlig blåhals har en rødbrun strubeplet, mens sydlig blåhals har en hvidlig strubeplet. Blåhals ynglede første gang i Danmark i 1992 efter cirka hundrede års fravær og har siden bredt sig i Sydvestjylland med anslået 265 ynglepar i 2011.",
    })
      .then((bird) => {
        console.log("Bird created:", bird.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create bird:", error);
      });

    Birds.create({
      species: "Råge",
      subspecies: "",
      order: "Spurvefugl",
      redList: "LC",
      description:
        'Rågen (Corvus frugilegus) er en kragefugl i ordenen af spurvefugle. Den har en længde på 45–48 cm. Råger yngler og overnatter i større eller mindre kolonier. På grund af støjen er de ikke altid lige populære naboer. Rågen ses ofte i flokke på marker. Den er fredet og må ikke jages. Rågen er helt sort på nær dens bare hudparti ved næbroden. Dette får også næbet til at se længere ud. Voksnes fjerdragt har metalglans i blåviolette farver, mens unge fugles fjerdragt er mere mat. Kønnene er ens. Rågen har "bukser", det vil sige fjerklædte ben. Desuden findes nedhængende fjer omkring den øverste del af benene samt opppustede, hængende bugfjer.',
    })
      .then((bird) => {
        console.log("Bird created:", bird.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create bird:", error);
      });
  }

  function createTestImages() {
    console.log("Creating images...");
    Images.create({
      id: 1,
      path: "uploads/93edf5f3fed21e2f57eb473f50456811.jpg",
      birdId: 2,
      //observationId: 1,
      ObservationId: 3,
    })
      .then((image) => {
        console.log("Image created:", image.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create image:", error);
      });

    Images.create({
      id: 2,
      path: "uploads/f6c6fc9f2cee76bae6801eb2abdd7fb9.jpg",
      birdId: 2,
      ObservationId: 3,
    })
      .then((image) => {
        console.log("Image created:", image.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create image:", error);
      });
    Images.create({
      id: 3,
      path: "uploads\\4885c01b231e82330c0c8ef83dee276f.jpg",
      birdId: 1,
      ObservationId: 2,
    })
      .then((image) => {
        console.log("Image created:", image.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create image:", error);
      });
  }

  function createTestObservations() {
    console.log("Creating observations...");
    Observations.create({
      date: "1999-02-12",
      note: "A note",
      birdId: 1,
      UserId: 1,
      //ImageId : 1,
    })
      .then((observationResult) => {
        console.log("Observation created:", observationResult.toJSON());
        Birds.findByPk(observationResult.toJSON().birdId);
        Users.findByPk(observationResult.toJSON().userId).then((result) =>
          console.log("Bird query:", result)
        );
      })
      .catch((error) => {
        console.error("Unable to create observation:", error);
      });
    Observations.create({
      date: "1998-02-12",
      note: "jeg så en blåhals!",
      birdId: 1,
      UserId: 1,
    })
      .then((observationResult) => {
        console.log("Observation created:", observationResult.toJSON());
        Birds.findByPk(observationResult.toJSON().birdId);
        Users.findByPk(observationResult.toJSON().userId).then((result) =>
          console.log("Bird query:", result)
        );
      })
      .catch((error) => {
        console.error("Unable to create observation:", error);
      });
    Observations.create({
      date: "2007-10-11",
      note: "A note",
      birdId: 2,
      UserId: 1,
    })
      .then((observationResult) => {
        console.log("Observation created:", observationResult.toJSON());
        Birds.findByPk(observationResult.toJSON().birdId);
        Users.findByPk(observationResult.toJSON().userId).then((result) =>
          console.log("Bird query:", result)
        );
      })
      .catch((error) => {
        console.error("Unable to create observation:", error);
      });
  }

  function createTestLocations() {
    console.log("Creating locations...");
    Locations.create({
      latitude: 12.015798,
      longitude: 55.585895,
      ObservationId: 1,
    })
      .then((location) => {
        console.log("Location created:", location.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create location:", error);
      });

    Locations.create({
      latitude: 11.978616,
      longitude: 55.254994,
      ObservationId: 2,
    })
      .then((location) => {
        console.log("Location created:", location.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create location:", error);
      });
  }

  function createTestUsers() {
    console.log("Creating users...");
    //const result = await bcrypt.hash("1234", 12);
    Users.create({
      firstName: "Bruce",
      lastName: "Wayne",
      email: "bw@wayneinterprise.com",
      //password: result,
      password: "123",
    })
      .then((user) => {
        console.log("User created: ", user.toJSON());
      })
      .catch((error) => {
        console.error("Unable to create user:", error);
      });
  }
}
