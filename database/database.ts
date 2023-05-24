import { Sequelize, DataTypes, DATE, TIME } from 'sequelize'
import bcrypt from 'bcrypt'; 
  

//Instantiate the database (in-memory for now)
export const sequelize = new Sequelize('sqlite::memory:')

//Define bird model
console.log('Defining model...')
export const Birds = sequelize.define('Birds', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
});

//Define observation model
console.log('Defining model...')
export const Observations = sequelize.define('Observations', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
},
time: {
    type: DataTypes.TIME,
    allowNull: true,
},
note: {
    type: DataTypes.STRING,
    allowNull: true,
}
});

//Define user model
console.log('Defining model...')
export const Users = sequelize.define('User', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
firstName: {
    type: DataTypes.STRING,
    allowNull: false,
},
lastName: {
    type: DataTypes.STRING,
    allowNull: false
},
email: {
    type: DataTypes.CHAR,
    allowNull: false
},
password: {
    type: DataTypes.INTEGER,
    allowNull: false
}
});

//Image Model
export const Images = sequelize.define('Images', {
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
Birds.hasMany(Observations, {as: 'observations', foreignKey: 'birdId'})
Observations.belongsTo(Birds, {as: 'bird', foreignKey: 'birdId'})
Birds.hasMany(Images, { as: 'images', foreignKey: 'birdId' });
Images.belongsTo(Birds, {as : 'bird', foreignKey: 'birdId' });
Users.hasMany(Observations, {as: 'observations', foreignKey: 'userId'})
Observations.belongsTo(Users, {as: 'user', foreignKey: 'userId'})


export function createDatabase() {
    
    //Test the connection
    console.log('Testing connection...')
    async function testConnection() {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.')
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    testConnection()

    //Sync database
    console.log('Syncing database...')
    sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        createTestBirds()
        createTestObservations()
        createTestUsers()
    })
    .catch((error) => {
        console.error('Unable to synchronize the database:', error);
    });

    //Create test data
    function createTestBirds() {
        console.log('Creating birds...')
        Birds.create({
            species: 'Blåhals',
            subspecies: 'Sydlig Blåhals',
            order: 'Spurvefugl',
            redList: 'LC'
        })
            .then((bird) => {
            console.log('Bird created:', bird.toJSON());
            })
            .catch((error) => {
            console.error('Unable to create bird:', error);
            });
            
        Birds.create({
            species: 'Råge',
            subspecies: '',
            order: 'Spurvefugl',
            redList: 'LC'
        })
            .then((bird) => {
            console.log('Bird created:', bird.toJSON());
            })
            .catch((error) => {
            console.error('Unable to create bird:', error);
            }); 
    }

    function createTestObservations() {
        console.log('Creating observations...')
        Observations.create({
            date : '1999-02-12',
            time : '11:31',
            note : 'A note',
            birdId: 1
        })
            .then((observationResult) => {
            console.log('Observation created:', observationResult.toJSON());
            Birds.findByPk(observationResult.toJSON().birdId).then((result) => console.log('Bird query:', result)) 
            })
            .catch((error) => {
            console.error('Unable to create observation:', error);
            });     
    }

    async function createTestUsers() {
        console.log('Creating users...')
        const result = await bcrypt.hash("1234", 12)
        Users.create({
            firstName: 'Bruce',
            lastName: 'Wayne',
            email: 'bw@wayneinterprise.com',
            password: result
        })
        .then((user) => {
            console.log('User created: ', user.toJSON());
        })
        .catch((error) => {
            console.error('Unable to create user:', error);
        });
    }  
}

