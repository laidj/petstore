const request = require('supertest');


describe('Creating pets', () => {
  const apiURL = 'https://petstore.swagger.io/v2';
  let petId;

  beforeEach(async () => {
    const newPet = {
      name: 'Fluffy',
      status: 'available'
    };

    const response = await request(apiURL)
      .post('/pet')
      .send(newPet)
      .expect(200);

    petId = response.body.id;
  });

  it('should create a new pet when all required fields are provided', async () => {
    const newPet = {
      name: 'Fluffy',
      status: 'available'
    };

    const response = await request(apiURL)
      .post('/pet')
      .send(newPet)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining(newPet));
  });

  it('should return a 200 status code and a pet object with default values when pet data is empty', async () => {
    const newPet = {};

    const response = await request(apiURL)
      .post('/pet')
      .send(newPet)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      id: expect.any(Number),
      photoUrls: [],
      tags: []
    }));
  });
});

describe('Deleting pets', () => {
  const apiURL = 'https://petstore.swagger.io/v2';

  it('should return 404 when a non-existing ID is provided', async () => {
    const nonExistingPetId = 999999; 

    const response = await request(apiURL)
      .delete(`/pet/${nonExistingPetId}`)
      .set('api_key', 'special-key')
      .expect(404);

    expect(response.body).toEqual({});
  });

  it('should return an error when an invalid ID is provided', async () => {
    const invalidPetId = 'invalid_id';

    const response = await request(apiURL)
      .delete(`/pet/${invalidPetId}`)
      .set('api_key', 'special-key')
      .expect(404);

    expect(response.body).toEqual(expect.objectContaining({ message: 'java.lang.NumberFormatException: For input string: "invalid_id"' }));
  });
});

describe('Finding Pets by status', () => {

  const status = 'available'; 
  const apiURL = 'https://petstore.swagger.io/v2'; 

  it('should find pets by status', async () => {

    const response = await request(apiURL)
      .get('/pet/findByStatus')
      .query({ status })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach(pet => {
      expect(pet.status).toBe(status);
    });
  });

  ['pending', 'sold'].forEach(status => {
    it(`should find pets with status ${status}`, async () => {
      const response = await request(apiURL)
        .get('/pet/findByStatus')
        .query({ status })
        .expect(200);
  
      expect(Array.isArray(response.body)).toBe(true);
  
      response.body.forEach(pet => {
        expect(pet.status).toBe(status);
      });
    });
  });


  it('should return an empty array for invalid status', async () => {
    const status = 'invalid_status';
    
    const response = await request(apiURL)
      .get('/pet/findByStatus')
      .query({ status })
      .expect(200);
  
    expect(response.body).toEqual(expect.arrayContaining([]));
  });

});

describe('Finding pets by ID', () => {
  const apiURL = 'https://petstore.swagger.io/v2';

  it('should return 404 for non-existing ID', async () => {
    const nonExistingPetId = 999999; 

    const response = await request(apiURL)
      .get(`/pet/${nonExistingPetId}`)
      .expect(404);

    expect(response.body).toEqual(expect.objectContaining({ message: 'Pet not found' }));
  });

  it('should return an error for invalid ID', async () => {
    const petId = 'invalid_id';
  
    const response = await request(apiURL)
      .get(`/pet/${petId}`)
      .expect(404); 
  
    expect(response.body).toEqual(expect.objectContaining({ message: 'java.lang.NumberFormatException: For input string: "invalid_id"' }));
  });

  it('should return an error when ID is not provided', async () => {
    const response = await request(apiURL)
      .get('/pet/')
      .expect(405); 
  
    expect(response.body).toEqual({});
  });
});

describe('Updating pets', () => {
  const apiURL = 'https://petstore.swagger.io/v2';

  it('should return 405 when a valid ID and data are provided', async () => {
    const petId = 1;

    const response = await request(apiURL)
      .put(`/pet/${petId}`)
      .send({
        name: 'UpdatedName',
        status: 'sold'
      })
      .expect(405);

    expect(response.body).toEqual({});
  });

  it('should return 405 when a non-existing ID is provided', async () => {
    const nonExistingPetId = 999999;

    const response = await request(apiURL)
      .put(`/pet/${nonExistingPetId}`)
      .send({
        name: 'UpdatedName',
        status: 'sold'
      })
      .expect(405);

    expect(response.body).toEqual({});
  });

  it('should return 200 and the created pet when ID is not provided', async () => {
    const response = await request(apiURL)
      .put('/pet/')
      .send({
        name: 'UpdatedName',
        status: 'sold'
      })
      .expect(200);
  
    expect(response.body).toEqual(expect.objectContaining({
      name: 'UpdatedName',
      status: 'sold'
    }));
  });
});