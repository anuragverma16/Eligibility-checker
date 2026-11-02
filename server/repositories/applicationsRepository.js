const PUBLIC_FIELDS = { _id: 0 };

// All reads and writes for the `applications` collection live here, so routes never touch Mongo directly.
export function createApplicationsRepository(db) {
  const collection = db.collection('applications');

  return {
    // Upsert by reference ID: resubmitting the same application updates it instead of duplicating it.
    async upsert({ referenceId, schemeId, status, values }) {
      const now = new Date();
      await collection.updateOne(
        { referenceId },
        {
          $set: { schemeId, status, values, updatedAt: now },
          $setOnInsert: { referenceId, createdAt: now },
        },
        { upsert: true },
      );
      return collection.findOne({ referenceId }, { projection: PUBLIC_FIELDS });
    },

    findByReference(referenceId) {
      return collection.findOne({ referenceId }, { projection: PUBLIC_FIELDS });
    },
  };
}
