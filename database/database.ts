import { Sequelize, DataTypes, DATE, TIME } from 'sequelize'

export function createDatabase() {
    //Instantiate the database (in-memory for now)
    const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite

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

    //Define bird model
    console.log('Defining model...')
    const Birds = sequelize.define('Birds', {
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
    const Observations = sequelize.define('Observations', {
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

    //Set up associations
    Birds.hasMany(Observations, {as: 'observations', foreignKey: 'birdId'})
    Observations.belongsTo(Birds, {as: 'bird', foreignKey: 'birdId'})

    //Sync database
    console.log('Syncing database...')
    sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        createTestBirds()
        createTestObservations()
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
        const observation = Observations.create({
            date : new DATE(),
            time : new TIME(),
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
    
}

