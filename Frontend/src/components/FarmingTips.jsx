import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  Lightbulb as TipIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import FarmerNavBar from './FarmerNavBar';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)',
  marginBottom: theme.spacing(3),
}));

const TipAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: '12px !important',
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.1)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    marginBottom: theme.spacing(2),
  },
}));

const FarmingTips = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const heroStyle = {
    background: 'linear-gradient(rgba(34,92,43,0.85), rgba(34,92,43,0.85)), url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat',
    color: 'white',
    padding: '80px 16px',
    textAlign: 'center',
    marginBottom: '40px',
  };

  const tips = [
    {
      category: 'Soil Management',
      color: '#8B4513',
      items: [
        {
          title: 'Test Your Soil Regularly',
          content: 'Regular soil testing helps you understand nutrient levels and pH. Test your soil at least once a year, preferably before planting season. This allows you to add the right fertilizers and amendments.',
        },
        {
          title: 'Improve Soil Health with Compost',
          content: 'Add organic compost to improve soil structure, water retention, and nutrient content. Compost helps create a healthy ecosystem for beneficial microorganisms that support plant growth.',
        },
        {
          title: 'Practice Crop Rotation',
          content: 'Rotate crops to prevent soil depletion and reduce pest problems. Different crops have different nutrient needs, so rotation helps maintain soil fertility naturally.',
        },
      ],
    },
    {
      category: 'Water Management',
      color: '#2196F3',
      items: [
        {
          title: 'Use Drip Irrigation',
          content: 'Drip irrigation delivers water directly to plant roots, reducing water waste and preventing leaf diseases. It\'s more efficient than overhead watering and can save up to 50% of water.',
        },
        {
          title: 'Water Early in the Morning',
          content: 'Water your crops early in the morning when temperatures are cooler. This reduces evaporation and allows plants to absorb water more effectively before the heat of the day.',
        },
        {
          title: 'Mulch to Retain Moisture',
          content: 'Apply mulch around plants to reduce water evaporation, suppress weeds, and maintain consistent soil temperature. Organic mulches also improve soil quality as they decompose.',
        },
      ],
    },
    {
      category: 'Pest & Disease Control',
      color: '#F44336',
      items: [
        {
          title: 'Use Natural Pest Control',
          content: 'Encourage beneficial insects like ladybugs and lacewings that prey on pests. Plant companion crops that naturally repel pests, such as marigolds or basil.',
        },
        {
          title: 'Monitor Crops Regularly',
          content: 'Inspect your crops regularly for signs of pests or diseases. Early detection allows for more effective treatment and prevents widespread damage.',
        },
        {
          title: 'Practice Good Sanitation',
          content: 'Remove diseased plants immediately and dispose of them properly. Clean tools between uses to prevent spreading diseases from one area to another.',
        },
      ],
    },
    {
      category: 'Crop Planning',
      color: '#4CAF50',
      items: [
        {
          title: 'Plan According to Seasons',
          content: 'Research which crops grow best in your region during different seasons. Plan your planting schedule to maximize yield and avoid unfavorable weather conditions.',
        },
        {
          title: 'Choose the Right Varieties',
          content: 'Select crop varieties that are well-suited to your climate, soil type, and growing conditions. Local varieties often perform better than imported ones.',
        },
        {
          title: 'Space Plants Properly',
          content: 'Follow recommended spacing guidelines for each crop. Proper spacing ensures adequate air circulation, reduces disease risk, and allows plants to reach their full potential.',
        },
      ],
    },
    {
      category: 'Harvesting & Storage',
      color: '#FF9800',
      items: [
        {
          title: 'Harvest at the Right Time',
          content: 'Harvest crops at their peak ripeness for best flavor and nutritional value. Different crops have different indicators of ripeness - learn the signs for each crop you grow.',
        },
        {
          title: 'Handle Produce Carefully',
          content: 'Handle harvested produce gently to avoid bruising and damage. Use clean containers and tools to prevent contamination.',
        },
        {
          title: 'Store Properly',
          content: 'Store different crops according to their requirements. Some need refrigeration, others need cool, dry places. Proper storage extends shelf life and maintains quality.',
        },
      ],
    },
  ];

  return (
    <Box sx={{ background: '#f5f9f5', minHeight: '100vh' }}>
      <FarmerNavBar />
      <header style={heroStyle}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontFamily: "'Poppins', sans-serif" }}>
          Farming Tips & Best Practices
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 800, mx: 'auto', fontFamily: "'Inter', sans-serif" }}>
          Expert advice to help you grow better crops and improve your farming practices
        </Typography>
      </header>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <StyledPaper>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TipIcon sx={{ fontSize: 40, color: '#2E7D32', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#225c2b', fontFamily: "'Poppins', sans-serif" }}>
              Essential Farming Tips
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            Whether you're a beginner or experienced farmer, these tips can help you improve your farming practices, 
            increase yields, and grow healthier crops. Click on each tip to learn more.
          </Typography>
        </StyledPaper>

        {tips.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip
                label={category.category}
                sx={{
                  backgroundColor: category.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '4px 8px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            </Box>
            {category.items.map((tip, tipIndex) => {
              const panelId = `panel-${categoryIndex}-${tipIndex}`;
              return (
                <TipAccordion
                  key={tipIndex}
                  expanded={expanded === panelId}
                  onChange={handleChange(panelId)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#2E7D32' }} />}
                    sx={{
                      backgroundColor: '#f8faf9',
                      borderRadius: expanded === panelId ? '12px 12px 0 0' : '12px',
                      '&:hover': {
                        backgroundColor: '#f0f5f0',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <CheckIcon sx={{ color: '#2E7D32', mr: 2 }} />
                      <Typography sx={{ fontWeight: 600, fontFamily: "'Poppins', sans-serif", color: '#225c2b' }}>
                        {tip.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: 'white', borderRadius: '0 0 12px 12px' }}>
                    <Typography sx={{ lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
                      {tip.content}
                    </Typography>
                  </AccordionDetails>
                </TipAccordion>
              );
            })}
          </Box>
        ))}

        <StyledPaper>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#225c2b', fontFamily: "'Poppins', sans-serif" }}>
            Remember
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontFamily: "'Inter', sans-serif", color: '#4b5a4f' }}>
            Every farm is unique, and what works for one farmer may need adjustment for another. 
            Start with these tips, observe how your crops respond, and adapt practices to suit your specific conditions. 
            Continuous learning and experimentation are key to successful farming.
          </Typography>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default FarmingTips;

