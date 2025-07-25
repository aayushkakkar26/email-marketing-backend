import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { parse } from 'csv-parse';
@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  async findAllByUser(userId: string): Promise<Contact[]> {
    return this.contactModel.find({ userId }).exec();
  }

  async create(data: { email: string; firstName: string; userId: string }) {
    const newContact = new this.contactModel(data);
    return newContact.save();
  }

  async parseAndSaveCSV(buffer: Buffer, userId: string) {
    const csvString = buffer.toString('utf-8');

    const records: any[] = await new Promise((resolve, reject) => {
      parse(
        csvString,
        {
          trim: true,
          columns: (header: string[]) =>
            header.map((h) => h.trim().replace(/[\uFEFF]/g, '')), // 🧹 Remove BOM and spaces
        },
        (err: Error | undefined, output: any[]) => {
          if (err) return reject(err);
          console.log('📄 Parsed Records:', output);
          resolve(output);
        },
      );
    });

    const contacts: any[] = [];

    for (const record of records) {
      const email = record['email'];
      const firstName = record['firstName'];
      if (!email || !firstName) continue;

      contacts.push({ email, firstName, userId });
    }

    console.log('📦 Contacts to insert:', contacts);

    if (contacts.length > 0) {
      try {
        const result = await this.contactModel.insertMany(contacts);
        console.log(`✅ Inserted: ${result.length} contacts`);
        return { success: true, inserted: result.length };
      } catch (error) {
        console.error('❌ Insert Error:', error);
        throw error;
      }
    } else {
      console.warn('⚠️ No valid contacts found in CSV');
      return { success: false, inserted: 0, reason: 'No valid contacts' };
    }
  }

  async deleteContact(id: string, userId: string) {
    const deleted = await this.contactModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!deleted) {
      throw new NotFoundException('Contact not found or unauthorized');
    }
    return { message: 'Contact deleted successfully' };
  }
}
