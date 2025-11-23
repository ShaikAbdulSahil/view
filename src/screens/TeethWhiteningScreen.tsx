import React, { useState } from 'react';
import { ScrollView, Text, Image, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TEETH_WHITENING from '../../assets/static_assets/TEETH_WHITENING.png';
import NO_SMOKING_ICON from '../../assets/static_assets/NO_SMOKING_ICON.png';

const TeethWhiteningScreen = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: 'Is it safe for everyone?',
      answer:
        'Yes, but not recommended for children under 16, pregnant/breastfeeding women, or those with sensitive teeth/gum disease.',
    },
    {
      question: 'How long does whitening last?',
      answer: '6 months to 3 years, depending on lifestyle.',
    },
    {
      question: 'Does it damage enamel?',
      answer: 'Not if done professionally. DIY methods can cause sensitivity.',
    },
    {
      question: 'Can all stains be removed?',
      answer:
        'Surface stains respond well; deep stains may need veneers or bonding.',
    },
    {
      question: 'Will it work on crowns/veneers?',
      answer: 'No, only works on natural teeth.',
    },
  ];

  return (
    <ScrollView
      style={{ padding: 16, backgroundColor: '#fff', paddingBottom: 120 }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
        🦷 Teeth Whitening: Brighten Your Smile!
      </Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#007acc' }}>
        💡 What Is Teeth Whitening?
      </Text>
      <Text style={{ marginTop: 4 }}>
        Teeth whitening is a cosmetic dental procedure that lightens the color
        of your teeth and removes stains and discoloration. It’s one of the most
        popular and affordable ways to improve your smile.
      </Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#007acc' }}>
        🔍 Why Do Teeth Get Discolored?
      </Text>
      <Text style={{ marginTop: 4 }}>
        Teeth can become yellow or stained due to:
      </Text>
      <Text>• ☕ Coffee, tea, red wine, and colored drinks</Text>
      <Text>• 🚬 Smoking or chewing tobacco</Text>
      <Text>• 🦷 Poor oral hygiene</Text>
      <Text>• 🧌 Natural aging process</Text>
      <Text>• 💊 Certain medications</Text>

      <Image
        source={TEETH_WHITENING}
        style={{
          width: '100%',
          height: 220,
          marginVertical: 16,
          borderRadius: 8,
        }}
        resizeMode="cover"
        fadeDuration={0}
        resizeMethod="resize"
      />

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#007f00' }}>
        ✅ Types of Teeth Whitening
      </Text>
      <Text>
        • In-Office Whitening: Fast results (1-hour session), high-concentration
        agents with laser or LED.
      </Text>
      <Text>
        • At-Home Whitening Kits: Custom-fitted trays by dentists. Takes a few
        days to weeks.
      </Text>
      <Text>
        • Over-the-Counter Products: Affordable, less effective. Best for mild
        stains.
      </Text>
      <Text>
        • Natural Remedies (⚠️ Not Dentist Recommended): May cause enamel
        damage.
      </Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#e67300' }}>
        ⚠️ Is Teeth Whitening Safe?
      </Text>
      <Text>
        Yes, when done correctly under professional guidance. Temporary
        sensitivity is common. Overuse can damage enamel.
      </Text>

      <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#007acc' }}>
        🛡️ How to Maintain a White Smile
      </Text>
      <Text>• Brush and floss daily</Text>
      <Text>• Rinse after drinking colored beverages</Text>
      <Text>• Avoid smoking or tobacco</Text>
      <Text>• Get regular dental cleanings</Text>
      <Text>• Use whitening toothpaste occasionally</Text>
      <Image
        source={NO_SMOKING_ICON}
        style={{
          width: '100%',
          height: 250,
          marginBottom: 16,
          borderRadius: 8,
          marginTop: 6,
        }}
        resizeMode="contain"
        fadeDuration={0}
        resizeMethod="resize"
      />

      <Text style={{ fontWeight: 'bold', color: '#cc0000' }}>
        🗓️ How Long Do Results Last?
      </Text>
      <Text>
        • Professional: 6 months to 3 years • Over-the-counter: few weeks to
        couple of months
      </Text>

      {/* FAQ SECTION */}
      <View
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: '#fff',
          margin: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#e53935',
            marginBottom: 16,
          }}
        >
          FAQs
        </Text>

        {faqs.map((faq, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 15, color: '#333', flex: 1 }}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={
                    activeIndex === index
                      ? 'chevron-up-outline'
                      : 'chevron-down-outline'
                  }
                  size={18}
                  color="#999"
                />
              </View>
            </TouchableOpacity>

            {activeIndex === index && (
              <Text style={{ marginTop: 6, color: '#666', lineHeight: 18 }}>
                {faq.answer}
              </Text>
            )}

            <View
              style={{
                height: 1,
                backgroundColor: '#eee',
                marginTop: 12,
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TeethWhiteningScreen;
